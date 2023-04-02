import { AllowedParts } from '../../src/types';
import { permute } from '../utils/permute';

export const validTemplates = permute(AllowedParts);
