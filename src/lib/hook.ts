import { useEffect, useState } from "react";

/**
 * Gets bounding boxes for an element. This is implemented for you
 */
export function getElementBounds(elem: HTMLElement) {
  const bounds = elem.getBoundingClientRect();
  const top = bounds.top + window.scrollY;
  const left = bounds.left + window.scrollX;

  return {
    x: left,
    y: top,
    top,
    left,
    width: bounds.width,
    height: bounds.height,
  };
}

/**
 * **TBD:** Implement a function that checks if a point is inside an element
 */
export function isPointInsideElement(
  coordinate: { x: number; y: number },
  element: HTMLElement,
): boolean {
  const elementBounds = getElementBounds(element);
  if (
    coordinate.x >= elementBounds.x &&
    coordinate.x <= elementBounds.x + elementBounds.width &&
    coordinate.y >= elementBounds.y &&
    coordinate.y <= elementBounds.y + elementBounds.height
  ) {
    return true;
  }
  return false;
}

/**
 * **TBD:** Implement a function that returns the height of the first line of text in an element
 * We will later use this to size the HTML element that contains the hover player
 */
export function getLineHeightOfFirstLine(element: HTMLElement): number {
  let htmlElement: HTMLElement = element
  while (htmlElement.children.length > 0 && (htmlElement.tagName !== "P" && htmlElement.tagName !== "BLOCKQUOTE")) {
    htmlElement = element.children[0] as HTMLElement;
  }
  return parseInt(window.getComputedStyle(htmlElement).fontSize)
}

export type HoveredElementInfo = {
  element: HTMLElement;
  top: number;
  left: number;
  heightOfFirstLine: number;
};

/**
 * **TBD:** Implement a React hook to be used to help to render hover player
 * Return the absolute coordinates on where to render the hover player
 * Returns null when there is no active hovered paragraph
 * Note: If using global event listeners, attach them window instead of document to ensure tests pass
 */
export function useHoveredParagraphCoordinate(
  parsedElements: HTMLElement[],
): HoveredElementInfo | null {
  const [elementInfo, setElementInfo] = useState<HoveredElementInfo | null>(
    null,
  );
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  window.addEventListener("mouseover", (e) => {
    setX(e.pageX);
    setY(e.pageY);
  });
  window.addEventListener("mouseout", (e) => {
    let element = document.getElementById("hover-player");
    if(element) element.id = "";
    // setX(e.pageX);
    // setY(e.pageY);
  })

  useEffect(() => {
    let index = 0;
    while (
      index < parsedElements.length &&
      !isPointInsideElement({ x, y }, parsedElements[index])
    ) {
      index++;
    }

    if (index < parsedElements.length) {
      let element = parsedElements[index];
      if(!element.id) element.id = "hover-player";
      setElementInfo({
        element: element,
        top: element.offsetTop,
        left: element.offsetLeft,
        heightOfFirstLine: getLineHeightOfFirstLine(element),
      });
    } else {
      setElementInfo(null);
    }
  }, [x, y]);

  return elementInfo;
}
