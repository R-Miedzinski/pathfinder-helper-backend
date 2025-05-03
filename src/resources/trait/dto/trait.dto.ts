import { ETraitContext } from "src/common/enums/trait-context.enum";

export class TraitDto {
    id: string;
    name: string;
    description: string;
    context: ETraitContext;
}