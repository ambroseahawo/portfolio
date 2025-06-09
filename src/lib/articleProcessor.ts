import type { CollectionEntry } from "astro:content"
import { JSDOM } from "jsdom"
import { marked, type MarkedOptions } from "marked"

type ContentEntry = CollectionEntry<"articles"> | CollectionEntry<"legal">

export async function processArticleContent(entry: ContentEntry) {
  let htmlContent = ""
  let updatedHtml = ""

  // Convert markdown to HTML
  const markedOptions: MarkedOptions = {
    gfm: true,
  }

  try {
    htmlContent = await Promise.resolve(
      marked.parse(entry.body || "", markedOptions)
    )
    // Use JSDOM to add IDs to h2s and extract TOC
    const dom = new JSDOM(htmlContent)

    // Wrap all content in sections
    const body = dom.window.document.body
    const allElements = Array.from(body.children)

    // Create first wrapper for content before first h2
    let currentWrapper = dom.window.document.createElement("div")
    currentWrapper.classList.add("c9gi4")
    body.insertBefore(currentWrapper, body.firstChild)

    for (const element of allElements) {
      if (element.tagName === "H2") {
        // Create new wrapper for h2 and its content
        currentWrapper = dom.window.document.createElement("div")
        currentWrapper.classList.add("c9gi4")
        body.insertBefore(currentWrapper, element)
        currentWrapper.appendChild(element)
      } else {
        // Move element to current wrapper
        currentWrapper.appendChild(element)
      }
    }

    // Add classes to h2s
    const h2s = dom.window.document.querySelectorAll("h2")
    h2s.forEach((h2) => {
      h2.classList.add("cxmc9", "cg0ht", "cpynq", "crvmr")
    })

    // Add classes to h3s
    const h3s = dom.window.document.querySelectorAll("h3")
    h3s.forEach((h3) => {
      h3.classList.add("cxmc9", "cg0ht", "cpynq", "cjvvo")
    })

    // Add classes to divs
    const divs = dom.window.document.querySelectorAll("div")
    divs.forEach((div) => {
      div.classList.add("c9gi4")
    })

    // Add classes to strong
    const strongs = dom.window.document.querySelectorAll("strong")
    strongs.forEach((strong) => {
      strong.classList.add("cxmc9", "cg0ht", "cnp10")
    })

    // Add classes to a
    const as = dom.window.document.querySelectorAll("a")
    as.forEach((a) => {
      a.classList.add("cm6cq", "chugl", "cnp10")
    })

    // Add classes to ul
    const uls = dom.window.document.querySelectorAll("ul")
    uls.forEach((ul) => {
      ul.classList.add("c2czg", "c0c3z", "csndo")
    })

    // Inject classes and styles into all images in the article content
    const imageElements = dom.window.document.querySelectorAll("img")
    imageElements.forEach((img) => {
      img.classList.add("c8pgj")
      img.width = 692
      img.height = 390
    })

    updatedHtml = dom.window.document.body.innerHTML
  } catch (error) {
    console.error("Error processing content:", error)
    updatedHtml = entry.body || ""
  }

  return updatedHtml
} 