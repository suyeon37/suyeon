import { GoogleGenAI } from "@google/genai";
import { GrowthStage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a prompt description based on the tree's growth stage.
 */
const getPromptForStage = (stage: GrowthStage): string => {
  const basePrompt = "A high-quality 3D render of a tree made entirely of plastic interlocking building blocks (Lego style). Isometric view, clean white background, soft studio lighting, voxel art style.";
  
  switch (stage) {
    case GrowthStage.SAPLING:
      return `${basePrompt} A small, cute sapling tree made of legos. A thin brown trunk with just a few bright green leaves on top. Simple and minimalist.`;
    case GrowthStage.SMALL_TREE:
      return `${basePrompt} A sturdy small tree made of legos. A distinct brown trunk and a round, compact cluster of green lego leaves.`;
    case GrowthStage.MEDIUM_TREE:
      return `${basePrompt} A medium-sized tree made of legos. The trunk is thicker, and the green foliage is lush and detailed with many small lego studs.`;
    case GrowthStage.LARGE_TREE:
      return `${basePrompt} A large, majestic tree made of legos. Thick brown trunk with roots visible, a wide canopy of dark and light green lego leaves.`;
    case GrowthStage.GIANT_TREE:
      return `${basePrompt} A massive, ancient tree made of legos. Complex root system spreading out, huge green canopy, very impressive construction scale.`;
    case GrowthStage.BUDDING_TREE:
      return `${basePrompt} A large lego tree transitioning into spring. Green leaves mixed with many small pink and white lego studs representing flower buds ready to bloom.`;
    case GrowthStage.FULL_BLOOM_TREE:
      return `${basePrompt} A spectacular lego tree in full bloom. The entire canopy is a cloud of pink and white lego flowers (Cherry Blossom style). Some loose lego flower petals on the ground. Magical and beautiful.`;
    default:
      return `${basePrompt} A nice lego tree.`;
  }
};

export const generateLegoTreeImage = async (stage: GrowthStage): Promise<string | null> => {
  try {
    const prompt = getPromptForStage(stage);
    
    // Using gemini-2.5-flash-image as per guidelines for general image generation
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt }
        ]
      },
      config: {
        imageConfig: {
            aspectRatio: "1:1", 
            // imageSize is not supported for flash-image, only pro-image-preview
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Failed to generate tree image:", error);
    return null;
  }
};

export const generateEncouragement = async (steps: number, totalBlocks: number): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `User has walked ${steps} steps and stacked ${totalBlocks} lego blocks to build a tree. 
      Give a very short, cute, motivating message in Korean (maximum 1 sentence) encouraging them to walk more to find more blocks. 
      Use emojis related to trees, flowers, walking, or legos.`,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Failed to generate text:", error);
    return "꽃을 피우기 위해 블록을 더 모아보세요! 🌸";
  }
};