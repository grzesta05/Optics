import { describe, test, expect, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import About from "../../src/routes/About";
import { BrowserRouter } from "react-router-dom";
import React from "react";

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

    expect(screen.getByText("About us")).toBeDefined();
  });

  test("renders link to Home", () => {
    render(
      <BrowserRouter>
        <About />
      </BrowserRouter>
    );

    expect(screen.getByText("Back")).toBeDefined();
  });
});
