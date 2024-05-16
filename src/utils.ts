import { encodePng } from '@lunapaint/png-codec'

export async function paletteToBase64(palette: number[], width: number, scale: number = 1) {
    let rgb_palette: [number, number, number, number][] = []

    for (const color of palette) {
        rgb_palette.push([
            color >> 16,
            color >> 8 & 0xff,
            color & 0xff,
            255
        ])
    }

    rgb_palette = scaleImage(rgb_palette, width, scale);

    const { data } = await encodePng({
        data: new Uint8Array(rgb_palette.flat()),
        width: width * scale,
        height: width * scale
    })
    
    return data
}

function scaleImage(imageData: any, originalWidth: any, scaleFactor: any) {
    const scaledWidth = originalWidth * scaleFactor;
    const scaledHeight = scaledWidth; // Assuming the image is square
    let scaledImageData = [];
  
    for (let y = 0; y < scaledHeight; y++) {
      for (let x = 0; x < scaledWidth; x++) {
        // Compute the original image's pixel corresponding to the current pixel
        const originalX = Math.floor(x / scaleFactor);
        const originalY = Math.floor(y / scaleFactor);
        const pixelIndex = originalY * originalWidth + originalX;
        const pixelData = imageData[pixelIndex];
  
        // Assign the pixel data from the original image
        scaledImageData.push(pixelData);
      }
    }
  
    return scaledImageData;
  }