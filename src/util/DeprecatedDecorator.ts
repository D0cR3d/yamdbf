import { Logger } from './logger/Logger';

/**
 * Logs a deprecation warning for the decorated class method
 * whenever it is called
 * @param {string} [message] Method deprecation message
 * @returns {MethodDecorator}
 */
export function deprecated<T extends Function>(message?: string): MethodDecorator
{
	return function(target: T, key: string, descriptor: PropertyDescriptor): PropertyDescriptor
	{
		if (!descriptor) descriptor = Object.getOwnPropertyDescriptor(target, key);
		const original: any = descriptor.value;
		const logger: Logger = Logger.instance('Deprecation');
		descriptor.value = function(...args: any[]): any
		{
			logger.warn(message || `${target.constructor.name}#${key}() is deprecated and will be removed in a future release.`);
			return original.apply(this, args);
		};
		return descriptor;
	};
}
