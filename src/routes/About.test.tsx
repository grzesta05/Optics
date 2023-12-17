import { describe, test, expect, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import About from "./About";
import { BrowserRouter } from "react-router-dom";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("About", () => {
  test("renders", () => {
    render(
      <BrowserRouter>
        <About />
      </BrowserRouter>
    );

    expect(screen.getByText("About")).toBeDefined();
  });

  test("renders link to Home", () => {
    render(
      <BrowserRouter>
        <About />
      </BrowserRouter>
    );

    expect(screen.getByText("Home")).toBeDefined();
  });
});
