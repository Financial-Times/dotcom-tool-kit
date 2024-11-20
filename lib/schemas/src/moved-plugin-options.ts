import { styles } from '@dotcom-tool-kit/logger'

export const movedPluginOptions = <T extends Record<string, unknown>>(option: string, task: string, newName = option) => [
	(options: T) => !(option in options),
	{
	  message: `the option ${styles.code(option)} has moved to ${styles.code(
					  `options.tasks.${styles.task(task)}.${newName}`
					)}`
	}
 ] as const
