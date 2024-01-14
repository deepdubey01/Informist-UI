// text-transform.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextTransformService {
  constructor() { }

  /**
   * Transforms text into capitalized form with underscore removal or lowercase if no underscores are present.
   *
   * @param inputText The input text to be transformed.
   * @returns The transformed text.
   */
  transformText(inputText: string): string {
    // Split the input text by underscores
    const words = inputText.split('_');

    // Capitalize the first letter of each word and join them with spaces
    const transformedText = words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    return transformedText;
  }
}
