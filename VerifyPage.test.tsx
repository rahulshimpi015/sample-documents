import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

// ─────────────────────────────────────────────────────────────────────────────
// Mocks
// ─────────────────────────────────────────────────────────────────────────────

vi.mock("./Input", () => ({
  default: React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement> & { variant?: string }
  >(({ variant: _v, ...rest }, ref) => <input ref={ref} {...rest} />),
}));

vi.mock("./cn", () => ({
  cn: (...args: unknown[]) => args.filter(Boolean).join(" "),
}));

import VerifyPage from "./VerifyPage";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getDigitInputs() {
  return screen.getAllByRole("textbox") as HTMLInputElement[];
}

async function fillOtp(digits: string) {
  const user = userEvent.setup();
  const inputs = getDigitInputs();
  for (let i = 0; i < digits.length; i++) {
    await user.type(inputs[i], digits[i]);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Group A — Input behaviour tests (real timers, no countdown interference)
// ─────────────────────────────────────────────────────────────────────────────

describe("VerifyPage — input behaviour", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // ── 1 ─────────────────────────────────────────────────────────────────────
  it("renders 6 empty digit inputs on mount", () => {
    render(<VerifyPage />);
    const inputs = getDigitInputs();
    expect(inputs).toHaveLength(6);
    inputs.forEach((input) => expect(input).toHaveValue(""));
  });

  // ── 2 ─────────────────────────────────────────────────────────────────────
  it("ignores non-numeric characters", async () => {
    render(<VerifyPage />);
    const user = userEvent.setup();
    const [first] = getDigitInputs();
    await user.type(first, "a");
    expect(first).toHaveValue("");
    await user.type(first, "!");
    expect(first).toHaveValue("");
    await user.type(first, "3");
    expect(first).toHaveValue("3");
  });

  // ── 3 ─────────────────────────────────────────────────────────────────────
  it("keeps Verify button disabled until all 6 cells are filled", async () => {
    render(<VerifyPage />);
    const verifyBtn = screen.getByRole("button", { name: /^verify$/i });
    const inputs = getDigitInputs();
    const user = userEvent.setup();
    expect(verifyBtn).toBeDisabled();
    // Type 5 digits — still disabled
    for (let i = 0; i < 5; i++) await user.type(inputs[i], String(i + 1));
    expect(verifyBtn).toBeDisabled();
    // Type the 6th digit — now enabled
    await user.type(inputs[5], "6");
    expect(verifyBtn).not.toBeDisabled();
  });

  // ── 4 ─────────────────────────────────────────────────────────────────────
  it("auto-triggers verification when the 6th digit is entered", async () => {
    render(<VerifyPage />);
    await act(async () => { await fillOtp("123456"); });
    // verifyOtp stub always throws → error alert confirms handleVerify fired
    await waitFor(() =>
      expect(screen.getByRole("alert")).toBeInTheDocument()
    );
  });

  // ── 5 ─────────────────────────────────────────────────────────────────────
  it("shows error message when verification fails", async () => {
    render(<VerifyPage />);
    await act(async () => { await fillOtp("000000"); });
    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(/invalid code/i)
    );
  });

  // ── 10 ────────────────────────────────────────────────────────────────────
  it("clears the current cell on Backspace", async () => {
    render(<VerifyPage />);
    const user = userEvent.setup();
    const [first] = getDigitInputs();
    await user.type(first, "5");
    expect(first).toHaveValue("5");
    fireEvent.keyDown(first, { key: "Backspace" });
    expect(first).toHaveValue("");
  });

  // ── 11 ────────────────────────────────────────────────────────────────────
  it("fills all cells when a 6-digit code is pasted", () => {
    render(<VerifyPage />);
    const group = screen.getByRole("group", { name: /one-time password/i });
    fireEvent.paste(group, {
      clipboardData: { getData: () => "654321" },
    });
    expect(getDigitInputs().map((i) => i.value).join("")).toBe("654321");
  });

  // ── 12 ────────────────────────────────────────────────────────────────────
  it("disables all digit inputs while verification is in flight", async () => {
    render(<VerifyPage />);
    // Trigger verify without waiting for the async to settle
    const inputs = getDigitInputs();
    fireEvent.change(inputs[0], { target: { value: "1" } });
    fireEvent.change(inputs[1], { target: { value: "2" } });
    fireEvent.change(inputs[2], { target: { value: "3" } });
    fireEvent.change(inputs[3], { target: { value: "4" } });
    fireEvent.change(inputs[4], { target: { value: "5" } });
    fireEvent.change(inputs[5], { target: { value: "6" } });
    await waitFor(() =>
      expect(getDigitInputs().every((inp) => inp.disabled)).toBe(true)
    );
  });

  // ── ArrowLeft moves focus to previous cell ────────────────────────────────
  it("ArrowLeft moves focus to the previous cell", async () => {
    render(<VerifyPage />);
    const inputs = getDigitInputs();
    inputs[1].focus();
    fireEvent.keyDown(inputs[1], { key: "ArrowLeft" });
    expect(document.activeElement).toBe(inputs[0]);
  });

  // ── ArrowRight moves focus to next cell ───────────────────────────────────
  it("ArrowRight moves focus to the next cell", async () => {
    render(<VerifyPage />);
    const inputs = getDigitInputs();
    inputs[0].focus();
    fireEvent.keyDown(inputs[0], { key: "ArrowRight" });
    expect(document.activeElement).toBe(inputs[1]);
  });

  // ── onBack prop is called when the back button is pressed ─────────────────
  it("calls onBack when the back arrow button is pressed", async () => {
    // Re-render OTPInput directly to test onBack prop
    const { OTPInput } = await import("./OTPInput");
    const onBack = vi.fn();
    render(<OTPInput onBack={onBack} autoFocus={false} />);
    const backBtn = screen.getByRole("button", { name: /go back/i });
    await userEvent.setup().click(backBtn);
    expect(onBack).toHaveBeenCalledOnce();
  });

  // ── Backspace on empty cell moves focus + clears previous cell ────────────
  it("Backspace on an empty cell clears the previous cell and moves focus back", async () => {
    render(<VerifyPage />);
    const user = userEvent.setup();
    const inputs = getDigitInputs();
    // Fill first two cells
    await user.type(inputs[0], "1");
    await user.type(inputs[1], "2");
    // Clear the second cell first so it is now empty
    fireEvent.keyDown(inputs[1], { key: "Backspace" });
    expect(inputs[1]).toHaveValue("");
    // Now press Backspace again on the empty second cell — should clear cell 0
    // and move focus back to it
    inputs[1].focus();
    fireEvent.keyDown(inputs[1], { key: "Backspace" });
    expect(inputs[0]).toHaveValue("");
    expect(document.activeElement).toBe(inputs[0]);
  });

  // ── getValue() returns "" when OTP is incomplete ──────────────────────────
  it("getValue returns empty string when not all cells are filled", async () => {
    const { OTPInput } = await import("./OTPInput");
    const ref = { current: null } as React.RefObject<import("./OTPInput").OTPInputHandle>;
    render(<OTPInput ref={ref} autoFocus={false} />);
    const user = userEvent.setup();
    // Only fill 3 of 6 cells
    const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];
    await user.type(inputs[0], "1");
    await user.type(inputs[1], "2");
    await user.type(inputs[2], "3");
    expect(ref.current?.getValue()).toBe("");
  });

  // ── localStorage failure falls back gracefully (catch branch) ─────────────
  it("handles localStorage being unavailable without crashing", async () => {
    // Simulate private browsing / storage blocked
    const original = Object.getOwnPropertyDescriptor(window, "localStorage");
    Object.defineProperty(window, "localStorage", {
      get() { throw new Error("storage blocked"); },
      configurable: true,
    });
    // Should render without throwing
    expect(() => render(<VerifyPage />)).not.toThrow();
    // Restore
    Object.defineProperty(window, "localStorage", original!);
  });

  // ── onChange fires on every keystroke ────────────────────────────────────
  it("fires onChange on every keystroke and onComplete only when all 6 are filled", async () => {
    const { OTPInput } = await import("./OTPInput");
    const onChange = vi.fn();
    const onComplete = vi.fn();
    const onCompleteChange = vi.fn();
    render(
      <OTPInput
        autoFocus={false}
        onChange={onChange}
        onComplete={onComplete}
        onCompleteChange={onCompleteChange}
      />
    );
    const user = userEvent.setup();
    const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];
    // Type 5 digits — onComplete must NOT fire yet
    for (let i = 0; i < 5; i++) await user.type(inputs[i], String(i + 1));
    expect(onChange).toHaveBeenCalledTimes(5);
    expect(onComplete).not.toHaveBeenCalled();
    expect(onCompleteChange).toHaveBeenLastCalledWith(false);
    // Type the 6th — onComplete fires exactly once with the full code
    await user.type(inputs[5], "6");
    expect(onComplete).toHaveBeenCalledOnce();
    expect(onComplete).toHaveBeenCalledWith("123456");
    expect(onCompleteChange).toHaveBeenLastCalledWith(true);
  });

  // ── paste with non-digit characters strips them ────────────────────────────
  it("strips non-digit characters from pasted content", async () => {
    const { OTPInput } = await import("./OTPInput");
    render(<OTPInput autoFocus={false} />);
    const group = screen.getByRole("group", { name: /one-time password/i });
    // Paste a mixed string — only digits should fill the cells
    fireEvent.paste(group, {
      clipboardData: { getData: () => "1a2b3c" },
    });
    const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];
    expect(inputs.map((i) => i.value).join("")).toBe("123000".replace(/0/g, ""));
    // Exactly 3 numeric chars extracted
    expect(inputs[0].value).toBe("1");
    expect(inputs[1].value).toBe("2");
    expect(inputs[2].value).toBe("3");
    expect(inputs[3].value).toBe("");
  });

  // ── paste with no digits is a no-op ───────────────────────────────────────
  it("ignores a paste that contains no digits", async () => {
    const { OTPInput } = await import("./OTPInput");
    render(<OTPInput autoFocus={false} />);
    const group = screen.getByRole("group", { name: /one-time password/i });
    fireEvent.paste(group, {
      clipboardData: { getData: () => "abcxyz" },
    });
    const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];
    inputs.forEach((input) => expect(input).toHaveValue(""));
  });

  // ── VerifyPage onBack wires through correctly ─────────────────────────────
  it("VerifyPage back button does not throw when clicked", async () => {
    render(<VerifyPage />);
    const backBtn = screen.getByRole("button", { name: /go back/i });
    expect(() => fireEvent.click(backBtn)).not.toThrow();
  });

});

// ─────────────────────────────────────────────────────────────────────────────
// Group B — Cooldown/timer tests (fake timers, no userEvent)
// ─────────────────────────────────────────────────────────────────────────────

describe("VerifyPage — resend cooldown", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ── 6 ─────────────────────────────────────────────────────────────────────
  it("disables the Resend button for 30 s on the first visit", async () => {
    render(<VerifyPage />);
    // flush the mount useEffect that seeds localStorage + sets secondsLeft
    await act(async () => { vi.advanceTimersByTime(0); });
    expect(screen.getByRole("button", { name: /resend/i })).toBeDisabled();
  });

  // ── 7 ─────────────────────────────────────────────────────────────────────
  it("enables the Resend button after 30 seconds have elapsed", async () => {
    render(<VerifyPage />);
    await act(async () => { vi.advanceTimersByTime(30_000); });
    expect(
      screen.getByRole("button", { name: /resend the code/i })
    ).not.toBeDisabled();
  });

  // ── 8 ─────────────────────────────────────────────────────────────────────
  it("clears OTP cells and restarts the cooldown when Resend is clicked", async () => {
    render(<VerifyPage />);
    // Expire the initial cooldown
    await act(async () => { vi.advanceTimersByTime(30_000); });
    const resendBtn = screen.getByRole("button", { name: /resend the code/i });
    // Pre-fill some cells via fireEvent (safe with fake timers)
    const inputs = getDigitInputs();
    fireEvent.change(inputs[0], { target: { value: "1" } });
    fireEvent.change(inputs[1], { target: { value: "2" } });
    fireEvent.change(inputs[2], { target: { value: "3" } });
    // Click Resend
    await act(async () => { fireEvent.click(resendBtn); });
    getDigitInputs().forEach((input) => expect(input).toHaveValue(""));
    expect(resendBtn).toBeDisabled();
  });

  // ── 9 ─────────────────────────────────────────────────────────────────────
  it("resumes the correct remaining time after a page reload", async () => {
    // Simulate a send that happened 10 s ago → ~20 s should remain
    localStorage.setItem("otp_sent_at", String(Date.now() - 10_000));
    render(<VerifyPage />);
    await act(async () => { vi.advanceTimersByTime(0); });
    // Still in cooldown
    expect(screen.getByRole("button", { name: /resend/i })).toBeDisabled();
    // After 20 more seconds the cooldown expires
    await act(async () => { vi.advanceTimersByTime(20_000); });
    expect(
      screen.getByRole("button", { name: /resend the code/i })
    ).not.toBeDisabled();
  });
});
