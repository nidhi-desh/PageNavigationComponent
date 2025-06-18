"use client";

import { useEffect, useRef, useState } from "react";

/* Set of forms/pages in form of buttons that we will be adding to the page */
const initialButtons = [
  { id: "info", label: "Info" },
  { id: "details", label: "Details" },
  { id: "other", label: "Other" },
  { id: "ending", label: "Ending" },
];

/* Content of the pages that we are adding using the buttons */
const content: Record<string, string> = {
  info: "This is the Info section content.",
  details: "This is the Details section content.",
  other: "This is the Other section content.",
  ending: "This is the Ending section content.",
};

export default function PageNavigation() {
  const [active, setActive] = useState("info"); // State for the currently active page
  const [buttons, setButtons] = useState(initialButtons);  // State for the list of pages (can be reordered)
  const [draggingId, setDraggingId] = useState<string | null>(null);   // ID of the button currently being dragged
  const [openPanelId, setOpenPanelId] = useState<string | null>(null);   // ID of the currently open settings panel
  const [focused, setFocused] = useState<string | null>(null);   // ID of the button currently being focused
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);  // Index of the button currently hovered (used to show "+" between pages)

  const panelRef = useRef<HTMLDivElement | null>(null);  // Reference to the settings panel DOM element (used to detect outside clicks)

  // Close the settings panel if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpenPanelId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Begin dragging a page
  const onDragStart = (id: string) => {
    setDraggingId(id);
  };

  // Drop and reorder pages
  const onDrop = (targetId: string) => {
    if (!draggingId || draggingId === targetId) return;
    const draggingIndex = buttons.findIndex((btn) => btn.id === draggingId);
    const targetIndex = buttons.findIndex((btn) => btn.id === targetId);

    const newButtons = [...buttons];
    const [moved] = newButtons.splice(draggingIndex, 1);
    newButtons.splice(targetIndex, 0, moved);

    setButtons(newButtons);
    setDraggingId(null);
  };

  // Add a new page after a given index
  const addPageBetween = (index: number) => {
    const newPage = {
      id: `new-${Date.now()}`,
      label: "New Page",
    };
    const newButtons = [...buttons];
    newButtons.splice(index + 1, 0, newPage);
    setButtons(newButtons);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-md p-4">
        <h1 className="text-2xl text-[#fec83a] font-bold">Fillout - Design as you please</h1>
      </header>

      {/* Main Section */}
      <main className="flex-grow p-6">
        <section className="bg-white p-10 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">
            {buttons.find((b) => b.id === active)?.label}
          </h2>
          <p>{content[active]}</p>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white p-6 shadow">
        <div className="flex gap-2 flex-wrap items-center">
          {buttons.map((btn, index) => (
            <div
              key={btn.id}
              draggable
              onDragStart={() => onDragStart(btn.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(btn.id)}
              className="relative flex items-center"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Button */}
              <div className="relative">
                <button
                  onClick={() => setActive(btn.id)}
                  onFocus={() => setFocused(btn.id)}
                  onBlur={() => setFocused(null)}
                  className={`flex items-center gap-2 px-[10px] py-[5px] rounded-[8px] text-sm transition relative
                  ${active === btn.id
                      ? "bg-white border border-[#E1E1E1] shadow-[0_1px_3px_0px_#0000000A,0_1px_1px_0px_#00000005]"
                      : "bg-[#9DA4B226] border border-transparent hover:bg-[#9DA4B259]"}
                  ${focused === btn.id ? "border border-[#2F72E2]" : ""}`}
                  style={{
                    fontFamily: "BL Melody",
                    fontWeight: 500,
                    fontSize: "16px",
                    lineHeight: "24px",
                    letterSpacing: "-0.015em",
                    verticalAlign: "middle",
                  }}
                >
                  <img
                    src={active === btn.id ? "/file.png" : "/file-grey.png"}
                    alt="icon"
                    className="w-5 h-5"
                  />
                  <span>{btn.label}</span>

                  {active === btn.id && (
                    <img
                      src="/verticalDots.png"
                      alt="menu icon"
                      className="w-4 h-4 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenPanelId(openPanelId === btn.id ? null : btn.id);
                      }}
                    />
                  )}
                </button>

                {/* Settings Panel */}
                {openPanelId === btn.id && (
                  <div
                    ref={panelRef}
                    className="absolute bottom-full mb-2 right-0 rounded-[12px] w-[240px] bg-white border border-gray-200 shadow-md z-10"
                  >
                    <div className="px-4 pt-3 pb-2 text-gray-800 font-semibold">
                      Settings
                    </div>
                    <div className="border-t border-gray-200 mb-1" />
                    <ul className="font-medium text-base leading-6 align-middle tracking-tight text-gray-700">
                      <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        <img src="/flag.png" alt="Rename" className="w-4 h-4" />
                        <span>Set as first page</span>
                      </li>
                      <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        <img src="/pencil.png" alt="Rename" className="w-4 h-4" />
                        <span>Rename</span>
                      </li>
                      <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        <img src="/clipboard.png" alt="Copy" className="w-4 h-4" />
                        <span>Copy</span>
                      </li>
                      <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        <img src="/copy.png" alt="Duplicate" className="w-4 h-4" />
                        <span>Duplicate</span>
                      </li>
                      <li className="border-t border-gray-200 my-1" />
                      <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        <img src="/delete.png" alt="Delete" className="w-4 h-4" />
                        <span className="text-red-500">Delete</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* + Add Button */}
              {hoveredIndex === index && index < buttons.length - 1 && (
                <button
                  className="mx-2 w-6 h-6 rounded-full bg-white text-gray-500 border border-gray-300 hover:bg-gray-200 shadow text-sm flex items-center justify-center"
                  onClick={() => addPageBetween(index)}
                >
                  +
                </button>
              )}
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}