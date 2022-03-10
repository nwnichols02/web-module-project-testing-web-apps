import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import ContactForm from "./ContactForm";

beforeEach(() => {
  render(<ContactForm />);
});

describe("Contact Form tests", () => {
  test("renders without errors", () => {
    //renders!
  });

  test("renders the contact form header", () => {
    const heading = screen.queryByRole("heading");
    expect(heading).toBeInTheDocument();
    expect(heading).toBeTruthy();
    expect(heading).toHaveTextContent(/contact form/i);
  });

  test("renders ONE error message if user enters less then 5 characters into firstname.", async () => {
    const inputFirst = screen.getByPlaceholderText("Edd");
    userEvent.type(inputFirst, "123");

    const errorMessages = await screen.findAllByTestId("error");
    expect(errorMessages).toHaveLength(1);
  });

  test("renders THREE error messages if user enters no values into any fields.", async () => {
    const submitBtn = screen.getByRole("button");
    userEvent.click(submitBtn);

    await waitFor(() => {
      const errorMessages = screen.queryAllByTestId("error");
      expect(errorMessages).toHaveLength(3);
    });
  });

  test("renders ONE error message if user enters a valid first name and last name but no email.", async () => {
    const inputFirst = screen.getByLabelText(/first name*/i);
    userEvent.type(inputFirst, "nathan");

    const inputLast = screen.getByLabelText(/last name*/i);
    userEvent.type(inputLast, "nichols");

    const submitBtn = screen.getByRole("button");
    userEvent.click(submitBtn);

    const errorMessages = await screen.queryAllByTestId("error");
    expect(errorMessages).toHaveLength(1);
  });

  test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    const inputEmail = screen.getByLabelText(/email*/i);
    userEvent.type(inputEmail, "fds.com");

    const errorMessages = await screen.findByText(
      /email must be a valid email address*/
    );
    expect(errorMessages).toBeInTheDocument();
  });

  test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    const submitBtn = screen.getByRole("button");
    userEvent.click(submitBtn);

    const errorMessages = await screen.findByText(
      /lastName is a required field*/
    );
    expect(errorMessages).toBeInTheDocument();
  });

  test("renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.", async () => {
    const inputFirst = screen.getByLabelText(/first name*/i);
    const inputLast = screen.getByLabelText(/last name*/i);
    const inputEmail = screen.getByLabelText(/email*/i);

    userEvent.type(inputFirst, "nathan");
    userEvent.type(inputLast, "nichols");
    userEvent.type(inputEmail, "asdf@gmail.com");

    const submitBtn = screen.getByRole("button");
    userEvent.click(submitBtn);

    await waitFor(() => {
      const firstDisplay = screen.queryByText("nathan");
      const lastDisplay = screen.queryByText("nichols");
      const emailDisplay = screen.queryByText("asdf@gmail.com");
      const messageDisplay = screen.queryByText("messageDisplay");
      expect(firstDisplay).toBeInTheDocument();
      expect(lastDisplay).toBeInTheDocument();
      expect(emailDisplay).toBeInTheDocument();
      expect(messageDisplay).not.toBeInTheDocument();
    });
  });

  test("renders all fields text when all fields are submitted.", async () => {
    const inputFirst = screen.getByLabelText(/first name*/i);
    const inputLast = screen.getByLabelText(/last name*/i);
    const inputEmail = screen.getByLabelText(/email*/i);
    const inputMessage = screen.getByLabelText(/message*/i);

    userEvent.type(inputFirst, "nathan");
    userEvent.type(inputLast, "nichols");
    userEvent.type(inputEmail, "asdf@gmail.com");
    userEvent.type(inputMessage, "Message Text");

    const submitBtn = screen.getByRole("button");
    userEvent.click(submitBtn);

    await waitFor(() => {
      const firstDisplay = screen.queryByText("nathan");
      const lastDisplay = screen.queryByText("nichols");
      const emailDisplay = screen.queryByText("asdf@gmail.com");
      const messageDisplay = screen.queryByText("Message Text");
      expect(firstDisplay).toBeInTheDocument();
      expect(lastDisplay).toBeInTheDocument();
      expect(emailDisplay).toBeInTheDocument();
      expect(messageDisplay).toBeInTheDocument();
    });
  });
});
