import { Direction, getDirection, LinearFunction } from "@/classes/Lines/LinearFunction.ts";
import Point from "@/classes/Point.ts";
import { Surface } from "@/classes/Lines/Surface.ts";
import { calculateLinearFromPointAndAngle } from "@/utils/geometry.ts";
import { toDegrees } from "@/utils/algebra.ts";

const REFLECTIONS_LIMIT = 10;

export class Particle extends LinearFunction {
	public color: string = "#FF0000";
	public intensity: number = 1;

	public reflexionIndex: number = 0;

	private _hasReflectionsCalculated: boolean = false;
	private _hasLimitsCalculated: boolean = false;
	public childReflections: Particle[] = [];

	public get hasReflectionsCalculated(): boolean {
		return this._hasReflectionsCalculated;
	}

	public get hasLimitsCalculated(): boolean {
		return this._hasLimitsCalculated;
	}

	public get angle(): number {
		return Math.atan(this.a);
	}

	private _currentReflectionSurface: Surface | null = null;
	private _currentReflectionPoint: Point | null = null;

	public resetCalculations(): void {
		this._hasReflectionsCalculated = false;
		this._hasLimitsCalculated = false;
		this.childReflections = [];
		this._currentReflectionSurface = null;
		this._currentReflectionPoint = null;
		if (this.direction === Direction.Left) {
			this.lowerLimit = -Infinity;
		} else {
			this.upperLimit = Infinity;
		}
	}

	/**
	 * Calculate the reflections of the light particle
	 * @param others The surfaces that the light particle can reflect on
	 * @param parent The parent particle - if the current particle is a reflection
	 */
	public calculateReflections(others: Surface[], parent: Particle | null): void {
		if (this._hasReflectionsCalculated) return;

		if (!this.hasLimitsCalculated) {
			this.calculateLimits(others);
		}

		if (this.reflexionIndex >= REFLECTIONS_LIMIT) {
			this._hasReflectionsCalculated = true;
			return;
		}

		if (this._currentReflectionSurface && this._currentReflectionPoint) {
			const reflectionIntensity = this.intensity * this._currentReflectionSurface.reflectivity;
			let angleBetween = this.angleBetween(this._currentReflectionSurface);

			// // get the point a little bit earlier than the reflection point
			let x = this.direction == Direction.Left ? 0.01 : -0.01;
			const actualReflectionPoint = this._currentReflectionPoint.clone().add(
				new Point(x, 0).rotate(toDegrees(this.angle))
			);
			const passThroughPoint = this._currentReflectionPoint.clone().add(
				new Point(-x, 0).rotate(toDegrees(this.angle))
			);
			if (reflectionIntensity > 0.0001) {
				const childReflection = this.rotateWithAPoint(angleBetween * 2, actualReflectionPoint);
				childReflection.reflexionIndex = this.reflexionIndex + 1;
				if (childReflection.direction === Direction.Right) {
					childReflection.lowerLimit = actualReflectionPoint.x;
				} else {
					childReflection.upperLimit = actualReflectionPoint.x;
				}
				childReflection.intensity = reflectionIntensity;

				if (parent) {
					parent.childReflections.push(childReflection);
				} else {
					this.childReflections.push(childReflection);
				}
				childReflection.calculateReflections(others, parent || this);
			}

			const passThroughIntensity = this.intensity * this._currentReflectionSurface.pernatrability;
			if (passThroughIntensity > 0.0001) {
				console.log("Sranie");

				const refractiveIndex = this.direction === Direction.Left ? this._currentReflectionSurface.ltrRefractiveIndex : this._currentReflectionSurface.rtlRefractiveIndex;

				let theta1 = Math.abs(this.angleBetween(this._currentReflectionSurface));
				theta1 = Math.PI / 2 - theta1;
				let theta2 = Math.asin(Math.sin(theta1) / refractiveIndex);

				const passThroughParticle = this.cloneWithNewPointAndAngle(
					passThroughPoint,
					this._currentReflectionSurface.angle + Math.PI / 2 + theta2
				);
				passThroughParticle.intensity = passThroughIntensity;
				passThroughParticle.reflexionIndex = this.reflexionIndex + 1;
				passThroughParticle.direction = this.direction;
				if (passThroughParticle.direction === Direction.Right) {
					passThroughParticle.lowerLimit = passThroughPoint.x;
				} else {
					passThroughParticle.upperLimit = passThroughPoint.x;
				}
				if (parent) {
					parent.childReflections.push(passThroughParticle);
				} else {
					this.childReflections.push(passThroughParticle);
				}
				passThroughParticle.calculateReflections(others, parent || this);
			}
		}

		this._hasReflectionsCalculated = true;
	}

	public calculateLimits(others: Surface[]): void {
		for (const other of others) {
			this.calculateLimitsUsing(other);
		}
		this._hasLimitsCalculated = true;
	}

	protected calculateLimitsUsing(other: Surface): void {
		const intersection = this.intersectionWith(other);
		if (intersection) {
			if (this.direction === Direction.Right && this.upperLimit > intersection.x) {
				this.upperLimit = intersection.x;
				this._currentReflectionSurface = other;
				this._currentReflectionPoint = intersection;
			} else if (this.lowerLimit < intersection.x) {
				this.lowerLimit = Math.max(this.lowerLimit, intersection.x);
				this._currentReflectionSurface = other;
				this._currentReflectionPoint = intersection;
			}
		}
	}

	constructor(
		a: number,
		b: number,
		direction: Direction,
		reflexionIndex: number = 0,
		color: string = "#FF0000",
		intensity: number = 1
	) {
		super(a, b, direction);
		this.reflexionIndex = reflexionIndex;
		this.color = color;
		this.intensity = intensity;
	}

	static fromPointAndAngle(point: Point, radians: number): Particle {
		const {a, b, direction} = calculateLinearFromPointAndAngle(point, radians);
		return new Particle(a, b, direction);
	}

	static fromTwoPoints(p1: Point, p2: Point, direction: Direction = Direction.Left): Particle {
		if (p1.x === p2.x) {
			p1.x += 0.0001;
		}

		const a = (p2.y - p1.y) / (p2.x - p1.x);
		const b = p1.y - a * p1.x;
		return new Particle(a, b, direction);
	}

	/**
	 * Returns a new Particle that is the result of rotating the current Particle around the given point
	 * @param radians The angle in radians to rotate the Particle by
	 * @param point The point to rotate the Particle around
	 */
	public rotateWithAPoint(radians: number, point: Point): Particle {
		const currentAngle = Math.atan(this.a);
		let newAngle = currentAngle + radians;
		const {x, y} = point;
		const a = Math.tan(newAngle);
		const b = y - a * x;
		if (this.direction === Direction.Left) {
			let originalDir = getDirection(newAngle);
			return new Particle(a, b, originalDir === Direction.Left ? Direction.Right : Direction.Left);
		}

		return new Particle(a, b, getDirection(newAngle));
	}

	public cloneWithNewPointAndAngle(point: Point, radians: number): Particle {
		const {a, b, direction} = calculateLinearFromPointAndAngle(point, radians);
		return new Particle(a, b, direction, this.reflexionIndex, this.color, this.intensity);
	}
}
