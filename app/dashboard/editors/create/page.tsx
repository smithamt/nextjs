"use client";
import { Button } from "@/components/ui/button";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Image,
  Italic,
  ListCollapse,
  PaintBucket,
  Printer,
  Redo,
  Underline,
  Undo,
} from "lucide-react";
import { FormEvent, useState } from "react";
import { BsListUl } from "react-icons/bs";
import { IoColorFill } from "react-icons/io5";

const TextEditor = () => {
  const [fontSize, setFontSize] = useState(16);
  const [htmlContent, setHtmlContent] = useState("");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textAlign, setTextAlign] = useState("");

  const handleChange = (event: FormEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    setHtmlContent(target.innerHTML);
    updateCommandStates();
  };

  const getCurrentFontSize = () => {
    const selection = window.getSelection();
    if (!selection) return;

    let size = 16;
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const parentElement = range.commonAncestorContainer.parentElement;
      if (parentElement && parentElement instanceof Element) {
        const computedStyle = window.getComputedStyle(parentElement);
        size = parseInt(computedStyle.fontSize, 10);
        setFontSize(size);
        return size;
      }
    }
  };

  const execCommand = (command: string, value: any = null) => {
    if (command === "fontSize") {
      const currentFontSize = getCurrentFontSize();
      const newFontSize = (currentFontSize || 16) - value;

      const selection = window.getSelection();
      if (!selection) return;
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();

        const newNode = document.createElement("span");
        newNode.style.fontSize = `${newFontSize}px`;
        newNode.textContent = selectedText;

        range.deleteContents();
        range.insertNode(newNode);

        const newRange = document.createRange();
        newRange.selectNodeContents(newNode);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    } else {
      document.execCommand(command, false, value);
    }
  };

  const handlePrint = () => {
    const printWindow =
      typeof window !== "undefined" &&
      window.open("", "", "height=400,width=800");
    if (!printWindow) return;
    printWindow.document.write("<html><head><title>Print</title></head><body>");
    printWindow.document.write(htmlContent);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  const applyStyle = (command: string, value: any = null) => {
    const selection = typeof window !== "undefined" && window.getSelection();
    if (!selection) return;
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    const span = document.createElement("span");
    span.style[Number(command)] = value;
    range.surroundContents(span);
    updateCommandStates();
  };

  const updateCommandStates = () => {
    const selection = typeof window !== "undefined" && window.getSelection();
    if (!selection) return;

    const range = selection.getRangeAt(0);
    const parentElement =
      range.commonAncestorContainer.nodeType === 1
        ? range.commonAncestorContainer
        : range.commonAncestorContainer.parentNode;

    if (parentElement && parentElement instanceof Element) {
      const computedStyle = window.getComputedStyle(parentElement);

      setIsBold(
        computedStyle.fontWeight === "bold" ||
          parseInt(computedStyle.fontWeight) >= 700
      );
      setIsItalic(computedStyle.fontStyle === "italic");
      setIsUnderline(computedStyle.textDecoration.includes("underline"));
      setTextAlign(computedStyle.textAlign);
      getCurrentFontSize();
    }
  };

  const handleKeyDown = (event: {
    key: string;
    preventDefault: () => void;
  }) => {
    if (event.key === "Tab") {
      event.preventDefault();
      const selection = typeof window !== "undefined" && window.getSelection();
      if (!selection) return;
      const range = selection.getRangeAt(0);
      const tabNode = document.createTextNode("\u00a0\u00a0\u00a0\u00a0"); // Insert 4 non-breaking spaces
      range.insertNode(tabNode);
      range.setStartAfter(tabNode);
      range.setEndAfter(tabNode);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  const insertImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        execCommand("insertImage", url);
        // makeImagesDraggableAndResizable();
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const pastedData =
      clipboardData.getData("text/html") || clipboardData.getData("text/plain");

    document.execCommand("insertHTML", false, pastedData);
  };

  return (
    <div className="w-full h-screen">
      <div className="p-2">
        <div className="w-full rounded-md nav-bg flex space-x-2 p-2 mb-2 shadow-sm">
          <Button
            className="w-8 h-8 p-0"
            variant={"outline"}
            onClick={() => execCommand("removeFormat")}
          >
            <PaintBucket />
          </Button>
          <Button
            className="w-8 h-8 p-0"
            variant={"outline"}
            onClick={() => execCommand("undo")}
          >
            <Undo className="w-4" />
          </Button>
          <Button
            className="w-8 h-8 p-0"
            variant={"outline"}
            onClick={() => execCommand("redo")}
          >
            <Redo className="w-4" />
          </Button>
          <Button
            className="w-8 h-8 p-0"
            variant={"outline"}
            onClick={handlePrint}
          >
            <Printer className="w-4" />
          </Button>
          <Button
            className="w-8 h-8 p-0 border-none"
            variant={"outline"}
            onClick={() => execCommand("fontSize", +2)}
          >
            -
          </Button>
          <input
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-8 px-1 h-8 border rounded-md"
            value={fontSize.toString()}
            type="number"
          />
          <Button
            className="w-8 h-8 p-0 border-none"
            variant={"outline"}
            onClick={() => execCommand("fontSize", -2)}
          >
            +
          </Button>
          <Button
            className="w-8 h-8 p-0"
            variant={isBold ? "default" : "outline"}
            onClick={() => execCommand("bold")}
          >
            <Bold className="w-4" />
          </Button>
          <Button
            className="w-8 h-8 p-0"
            variant={isItalic ? "default" : "outline"}
            onClick={() => execCommand("italic")}
          >
            <Italic className="w-4" />
          </Button>
          <Button
            className="w-8 h-8 p-0"
            variant={isUnderline ? "default" : "outline"}
            onClick={() => execCommand("underline")}
          >
            <Underline className="w-4" />
          </Button>
          <Button
            className="w-8 h-8 p-0"
            variant={"outline"}
            onClick={() => applyStyle("color", "blue")}
          >
            <IoColorFill className="w-4" />
          </Button>
          <Button
            className="w-8 h-8 p-0"
            variant={textAlign === "left" ? "default" : "outline"}
            onClick={() => execCommand("justifyLeft")}
          >
            <AlignLeft className="w-4" />
          </Button>
          <Button
            className="w-8 h-8 p-0"
            variant={textAlign === "center" ? "default" : "outline"}
            onClick={() => execCommand("justifyCenter")}
          >
            <AlignCenter className="w-4" />
          </Button>
          <Button
            className="w-8 h-8 p-0"
            variant={textAlign === "right" ? "default" : "outline"}
            onClick={() => execCommand("justifyRight")}
          >
            <AlignRight className="w-4" />
          </Button>
          <Button
            className="w-8 h-8 p-0"
            variant={textAlign === "justify" ? "default" : "outline"}
            onClick={() => execCommand("justifyFull")}
          >
            <AlignJustify className="w-4" />
          </Button>
          <Button
            className="w-8 h-8 p-0"
            variant={"outline"}
            onClick={() => execCommand("insertOrderedList")}
          >
            <ListCollapse className="w-4" />
          </Button>
          <Button
            className="w-8 h-8 p-0"
            variant={"outline"}
            onClick={() => execCommand("insertUnorderedList")}
          >
            <BsListUl size={18} />
          </Button>
          <input
            type="file"
            accept="image/*"
            onChange={insertImage}
            style={{ display: "none" }}
            id="fileInput"
          />
          <Button
            className="w-8 h-8 p-0"
            variant={"outline"}
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            <Image className="w-4" />
          </Button>
        </div>
      </div>
      <div className="w-full overflow-y-auto h-[calc(100%-50px)] p-2">
        <div className="nav-bg w-full p-4">
          <div
            onInput={handleChange}
            onKeyUp={updateCommandStates}
            onMouseUp={updateCommandStates}
            onKeyDown={handleKeyDown}
            className="border cart-bg w-a4 min-h-[297mm] p-4 outline-none mx-auto"
            contentEditable
            onPaste={handlePaste}
            style={{
              fontSize: "16px",
            }}
          />
        </div>
      </div>
      <div className="preview mt-4 p-2 border">
        <h3>Preview:</h3>
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
      <div className="code-preview mt-4 p-2 border">
        <h3>HTML Code:</h3>
        {htmlContent}
      </div>
    </div>
  );
};

export default TextEditor;

// const makeImagesDraggableAndResizable = () => {
//   const images = document.querySelectorAll(".contentEditable img");
//   images.forEach((img) => {
//     img.style.resize = "both";
//     img.style.overflow = "auto";
//     img.style.position = "relative";
//     img.style.cursor = "move";

//     img.onmousedown = (e) => {
//       e.preventDefault();
//       const img = e.target as HTMLElement;
//       let shiftX = e.clientX - img.getBoundingClientRect().left;
//       let shiftY = e.clientY - img.getBoundingClientRect().top;

//       const moveAt = (pageX, pageY) => {
//         img.style.left = pageX - shiftX + "px";
//         img.style.top = pageY - shiftY + "px";
//       };

//       const onMouseMove = (e) => {
//         moveAt(e.pageX, e.pageY);
//       };

//       document.addEventListener("mousemove", onMouseMove);

//       img.onmouseup = () => {
//         document.removeEventListener("mousemove", onMouseMove);
//         img.onmouseup = null;
//       };
//     };

//     img.ondragstart = () => false;
//   });
// };

// useEffect(() => {
//   makeImagesDraggableAndResizable();
// }, [htmlContent]);
