export const createPromiseState = <T>(promise: Promise<T>) => {
	let current = $state<T>()
	let error = $state<unknown>()
	let loading = $state(true)

	promise
		.then((value) => {
			current = value
		})
		.catch((e) => {
			error = e
		})
		.finally(() => {
			loading = false
		})

	return {
		get current() {
			return current
		},
		get error() {
			return error
		},
		get loading() {
			return loading
		},
	}
}
