import {expect} from '@playwright/test';
import type {Page} from '@playwright/test';
import {crudResources} from '../../src/app/locales/crud';
export async function discardChanges(page:Page,language='es-CO'){
 const text=crudResources[language],dialog=page.getByRole('dialog',{name:text.unsavedTitle,exact:true});
 await expect(dialog).toBeVisible();await dialog.getByRole('button',{name:text.discard,exact:true}).click();
}
