export enum GrowthStage {
  SAPLING = 0,      // 묘목 (Start)
  SMALL_TREE = 1,   // 작은 나무
  MEDIUM_TREE = 2,  // 중간 나무
  LARGE_TREE = 3,   // 큰 나무
  GIANT_TREE = 4,   // 거대한 나무
  BUDDING_TREE = 5, // 꽃망울이 맺힌 나무
  FULL_BLOOM_TREE = 6 // 꽃이 활짝 핀 나무 (End)
}

export interface TreeData {
  stage: GrowthStage;
  blocksAdded: number; // Blocks added to current stage
  totalBlocks: number; // Total blocks in history
  imageUrl: string | null;
  name: string;
}

export interface UserStats {
  steps: number;
  availableBlocks: number; // Blocks converted from steps but not yet built
}

export const STEPS_PER_BLOCK = 100;
// User requested 2000 steps to level up. 
// 2000 steps / 100 steps per block = 20 blocks per stage.
export const BLOCKS_PER_STAGE = 20; 