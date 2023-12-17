import { describe, test, expect, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./Home";
import { BrowserRouter } from "react-router-dom";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Home", () => {
  test("renders", () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByText("Home")).toBeDefined();
  });

  test("renders link to About", () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByText("About")).toBeDefined();
  });
});
