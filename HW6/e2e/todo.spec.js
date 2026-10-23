
const { test, expect } = require('@playwright/test');

test('user can add a todo', async ({ page }) => {
  await page.goto('/');

  await page.getByPlaceholder('Enter a task')
    .fill('Finish homework');

  await page.getByRole('button', { name: 'Add Todo' })
    .click();

  await expect(page.getByText('Finish homework'))
    .toBeVisible();
});

test('user can complete a todo', async ({ page }) => {
  await page.goto('/');

  await page.getByPlaceholder('Enter a task')
    .fill('Study programming');

  await page.getByRole('button', { name: 'Add Todo' })
    .click();

  const todo = page.locator('li').filter({
    hasText: 'Study programming'
  });

  await todo.getByRole('button', { name: 'Complete' })
    .click();

  await expect(todo.locator('span'))
    .toHaveClass(/completed/);
});

test('user can delete a todo', async ({ page }) => {
  await page.goto('/');

  await page.getByPlaceholder('Enter a task')
    .fill('Delete this task');

  await page.getByRole('button', { name: 'Add Todo' })
    .click();

  const todo = page.locator('li').filter({
    hasText: 'Delete this task'
  });

  await todo.getByRole('button', { name: 'Delete' })
    .click();

  await expect(page.getByText('Delete this task'))
    .toHaveCount(0);
});
