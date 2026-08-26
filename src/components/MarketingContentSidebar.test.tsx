import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MarketingContentSidebar } from "@/components/MarketingContentSidebar";

describe("MarketingContentSidebar", () => {
  it("renders the generated headline and body copy", () => {
    render(
      <MarketingContentSidebar
        content={{
          headline: "A must-read",
          bodyCopy: "Discover The Great Gatsby by F. Scott Fitzgerald.",
        }}
      />,
    );

    expect(screen.getByText("Featured")).toBeInTheDocument();
    expect(screen.getByText("A must-read")).toBeInTheDocument();
    expect(
      screen.getByText("Discover The Great Gatsby by F. Scott Fitzgerald."),
    ).toBeInTheDocument();
  });

  it("renders inside a complementary <aside> landmark", () => {
    const { container } = render(
      <MarketingContentSidebar content={{ headline: "H", bodyCopy: "B" }} />,
    );

    expect(container.querySelector("aside")).toBeInTheDocument();
  });
});
