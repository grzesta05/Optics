import { describe, test, expect, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Start from "../../src/routes/Start";
import { BrowserRouter } from "react-router-dom";
import React from "react";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Start", () => {
  test("renders", () => {
    render(
      <BrowserRouter>
        <Start />
      </BrowserRouter>
    );

    expect(screen.getByTestId("StartScreen")).toBeDefined();
  });

  test("renders SimulationBoard", () => {
    render(
      <BrowserRouter>
        <Start />
      </BrowserRouter>
    );

    expect(screen.getByTestId("SimulationBoard")).toBeDefined();
  });
});
