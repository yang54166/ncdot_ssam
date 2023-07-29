import { ValueIfExists } from '../../Common/Library/Formatter';
import GetCategoryByProperties from './GetCategoryByProperties';

export default function Category3Value1(context) {
    if (context.binding && context.binding.SchemaID1 && context.binding.CategoryID1) {
        return GetCategoryByProperties(context, '3', context.binding.SchemaID1, context.binding.CategoryID1).then((result) => {
            return ValueIfExists(result.CategoryName);
        });
    } else {
        const category = context.binding.Category3_1_Nav ? context.binding.Category3_1_Nav.CategoryName : null;
        return ValueIfExists(category);
    }
}
