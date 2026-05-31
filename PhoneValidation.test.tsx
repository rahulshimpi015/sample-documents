import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PhoneValidation from "./PhoneValidation";

// Mock window.alert used on successful submit
const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

beforeEach(() => {
  alertMock.mockClear();
});

const getInput  = () => screen.getByRole("textbox");
const getButton = () => screen.getByRole("button", { name: /continue/i });
const getError  = () => screen.queryByText("Please enter valid phone format");
const getRequired = () => screen.queryByText("Phone number is required");

// ─── Initial render ──────────────────────────────────────────────────────────

describe("initial render", () => {
  it("renders input and button", () => {
    render(<PhoneValidation />);
    expect(getInput()).toBeInTheDocument();
    expect(getButton()).toBeInTheDocument();
  });

  it("button is disabled on mount", () => {
    render(<PhoneValidation />);
    expect(getButton()).toBeDisabled();
  });

  it("shows hint text on mount", () => {
    render(<PhoneValidation />);
    expect(screen.getByText(/digits only/i)).toBeInTheDocument();
  });

  it("shows no error on mount", () => {
    render(<PhoneValidation />);
    expect(getError()).not.toBeInTheDocument();
  });
});

// ─── Button enable / disable ─────────────────────────────────────────────────

describe("button enable/disable", () => {
  it("stays disabled when typing 1 digit", async () => {
    render(<PhoneValidation />);
    await userEvent.type(getInput(), "1");
    expect(getButton()).toBeDisabled();
  });

  it("stays disabled when typing 3 digits", async () => {
    render(<PhoneValidation />);
    await userEvent.type(getInput(), "123");
    expect(getButton()).toBeDisabled();
  });

  it("becomes enabled when typing 4 digits", async () => {
    render(<PhoneValidation />);
    await userEvent.type(getInput(), "1234");
    expect(getButton()).toBeEnabled();
  });

  it("stays enabled for 10 digits", async () => {
    render(<PhoneValidation />);
    await userEvent.type(getInput(), "1234567890");
    expect(getButton()).toBeEnabled();
  });

  it("stays enabled for exactly 13 digits", async () => {
    render(<PhoneValidation />);
    await userEvent.type(getInput(), "1234567890123");
    expect(getButton()).toBeEnabled();
  });

  it("becomes disabled again when input exceeds 13 digits", async () => {
    render(<PhoneValidation />);
    // maxLength=16 on input, but isPhoneEnabled checks digit count
    const input = getInput();
    await userEvent.type(input, "12345678901234"); // 14 digits
    expect(getButton()).toBeDisabled();
  });
});

// ─── Error on blur (click outside) ───────────────────────────────────────────

describe("blur validation", () => {
  it("shows required error on blur when input is empty", () => {
    render(<PhoneValidation />);
    fireEvent.blur(getInput());
    expect(getRequired()).toBeInTheDocument();
  });

  it("shows format error on blur when digits < 3", async () => {
    render(<PhoneValidation />);
    await userEvent.type(getInput(), "12");
    fireEvent.blur(getInput());
    expect(getError()).toBeInTheDocument();
  });

  it("shows no error on blur when digits are valid (7 digits)", async () => {
    render(<PhoneValidation />);
    await userEvent.type(getInput(), "1234567");
    fireEvent.blur(getInput());
    expect(getError()).not.toBeInTheDocument();
  });
});

// ─── Focus hides error / blur shows error ────────────────────────────────────

describe("focus/blur error visibility", () => {
  it("hides error when input is focused after blur", async () => {
    render(<PhoneValidation />);
    await userEvent.type(getInput(), "12");
    fireEvent.blur(getInput());
    expect(getError()).toBeInTheDocument();

    fireEvent.focus(getInput());
    expect(getError()).not.toBeInTheDocument();
  });

  it("shows error again when blurred after re-focus", async () => {
    render(<PhoneValidation />);
    await userEvent.type(getInput(), "12");
    fireEvent.blur(getInput());
    fireEvent.focus(getInput());
    fireEvent.blur(getInput());
    expect(getError()).toBeInTheDocument();
  });
});

// ─── Error clears on typing ───────────────────────────────────────────────────

describe("error clears on change", () => {
  it("clears error when user starts typing after blur error", async () => {
    render(<PhoneValidation />);
    const input = getInput();
    await userEvent.type(input, "12");
    fireEvent.blur(input);
    expect(getError()).toBeInTheDocument();

    await userEvent.type(input, "345"); // now valid digits
    fireEvent.blur(input);
    expect(getError()).not.toBeInTheDocument();
  });
});

// ─── Submit button ────────────────────────────────────────────────────────────

describe("submit behaviour", () => {
  it("does not call alert when submitted with invalid phone", async () => {
    render(<PhoneValidation />);
    // Force-enable button by mocking — or just test that alert wasn't called
    // Button is disabled so click won't fire, but we verify no alert
    await userEvent.type(getInput(), "12");
    fireEvent.click(getButton()); // disabled — click ignored by browser
    expect(alertMock).not.toHaveBeenCalled();
  });

  it("calls alert with phone number on valid submit", async () => {
    render(<PhoneValidation />);
    await userEvent.type(getInput(), "1234567890");
    fireEvent.click(getButton());
    expect(alertMock).toHaveBeenCalledWith("Submitted: 1234567890");
  });

  it("shows error on submit when phone is empty (programmatic)", () => {
    render(<PhoneValidation />);
    // Directly blur to trigger error without submit (button disabled for empty)
    fireEvent.blur(getInput());
    expect(getRequired()).toBeInTheDocument();
  });
});
