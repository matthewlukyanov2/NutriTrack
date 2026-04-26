import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dashboard from "./Dashboard";

const mockGet = jest.fn();
const mockPost = jest.fn();

// Mock the API module to control responses during testing
jest.mock("../services/api", () => ({
  __esModule: true,
  default: {
    get: (...args) => mockGet(...args),
    post: (...args) => mockPost(...args),
  },
}));

jest.mock("../utils/auth", () => ({
  logout: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();

  Storage.prototype.getItem = jest.fn(() =>
    JSON.stringify({ name: "Test User" })
  );

  mockGet.mockResolvedValue({ data: [] });
  mockPost.mockResolvedValue({ data: {} });
});

test("renders dashboard title", async () => {
  render(<Dashboard />);

  expect(await screen.findByText(/welcome back/i)).toBeInTheDocument();
});

test("renders Generate Weekly Plan button", async () => {
  render(<Dashboard />);

  expect(
    await screen.findByText(/Generate Weekly Plan/i)
  ).toBeInTheDocument();
});

test("switches to weekly view when button clicked", async () => {
  const user = userEvent.setup();

  render(<Dashboard />);

  // Wait for the button to be rendered before clicking
  const weeklyButton = await screen.findByRole("button", {
    name: /^weekly$/i,
  });

  await user.click(weeklyButton);

  expect(
    await screen.findByText(/weekly calorie trend/i)
  ).toBeInTheDocument();
});