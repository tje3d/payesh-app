export function zodFormat(z: Zod.ZodIssue) {
  switch (z.code) {
    case 'too_small':
      if (z.minimum === 1) {
        z.message = 'نمیتواند خالی باشد'
        return
      }

      z.message = `باید حداقل ${z.minimum} کاراکتر باشد`
      break
  }
}
