import { z } from 'zod';
import { echoLoad } from '$lib/echo';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';

const _schema = z.object({
  delay: z.number().int().min(0).max(9900).default(4000)
});

export const load = echoLoad(_schema);

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    console.log("🚀 ~ default: ~ formData:", formData)
    const form = await superValidate(formData, zod(_schema));

    if (!form.valid) {
      return fail(400, { form });
    }
    console.log("🚀 ~ default: ~ form:", form)

    await new Promise((resolve) =>
      setTimeout(resolve, form.data.delay)
    );

    return message(form, 'Form posted successfully!');
  }
}
