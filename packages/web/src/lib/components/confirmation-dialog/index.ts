import { mount, unmount } from 'svelte'
import ConfirmationDialog, { type ConfirmationDialogProps } from './confirmation-dialog.svelte'

export const runConfirmationDialog = (
	props: Omit<ConfirmationDialogProps, 'onChoice'>,
): Promise<boolean> => {
	const { promise, resolve } = Promise.withResolvers<boolean>()

	const destroy = () => unmount(instance)
	const instance = mount(ConfirmationDialog, {
		target: document.body,
		props: {
			...props,
			onChoice: (choice) => {
				resolve(choice)

				// Wait for outro before destroying
				setTimeout(() => destroy(), 500)
			},
		},
	})

	return promise
}
