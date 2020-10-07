declare module "lib/utils/log" {
    export namespace log {
        function all(msg: any): void;
        function debug(msg: any): void;
        function info(msg: any): void;
        function warn(msg: any): void;
        function error(msg: any): void;
        function fatal(msg: any): void;
        function off(msg: any): void;
        function trace(msg: any): void;
    }
}
declare module "lib/utils/index" {
    const _exports: {
        log: {
            all: (msg: any) => void;
            debug: (msg: any) => void;
            info: (msg: any) => void;
            warn: (msg: any) => void;
            error: (msg: any) => void;
            fatal: (msg: any) => void;
            off: (msg: any) => void;
            trace: (msg: any) => void;
        };
        normalizePluginConfig: typeof normalizePluginConfig;
        isObject: (v: any) => boolean;
        deepAssign: typeof deepAssign;
    };
    export = _exports;
    /**
     * converts 'foo' to
     *   { name: 'foo', params: {} }
     * and { bar: { baz: 123 } } to
     *   { name: 'bar', params: { baz: 123 } }
     * @param {string|object=} entry
     * @return {RoxiPluginConfig}
     */
    function normalizePluginConfig(entry?: (string | object) | undefined): RoxiPluginConfig;
    /**
     * @template {{}} T
     * @template {{}} T2
     * @param {T} target
     * @param  {...T2} sources
     * @return {T&Partial<T2>} //jsdoc unaware of mutation - incorrectly wants partial T2
     */
    function deepAssign<T extends {}, T2 extends {}>(target: T, ...sources: T2[]): T & Partial<T2>;
}
declare module "lib/roxi" {
    namespace config {
        const plugins: RoxiPluginConfigured[];
        const port: string;
        const host: string;
        const bundler: string;
        const staticDir: string;
        const template: string;
        const buildDir: string;
        const script: string;
        const distDir: string;
        const logLevel: string;
    }
    export function run(): Promise<{
        plugins: (RoxiPlugin & RoxiPluginConfig)[];
        port: string;
        host: string;
        bundler: string;
        staticDir: string;
        template: string;
        buildDir: string;
        script: string;
        distDir: string;
        logLevel: string;
    }>;
    export namespace template {
        export { config as roxi };
    }
    export {};
}
declare module "lib/app" {
    export const App: {
        new (): {
            events: ("end" | "start" | "router" | "*" | "init" | "config" | "before:config" | "after:config" | "before:bundle" | "bundle" | "after:bundle")[];
            state: {};
            log: {
                all: (msg: any) => void;
                debug: (msg: any) => void;
                info: (msg: any) => void;
                warn: (msg: any) => void;
                error: (msg: any) => void;
                fatal: (msg: any) => void;
                off: (msg: any) => void;
                trace: (msg: any) => void;
            };
            config: {};
            merge(obj: any): void;
            initiate(): Promise<void>;
            run(events?: ("end" | "start" | "router" | "*" | "init" | "config" | "before:config" | "after:config" | "before:bundle" | "bundle" | "after:bundle")[]): Promise<void>;
        };
    };
}
declare module "lib/plugins/rollup/rollup.template" {
    var _default: RoxiPluginHookFunction;
    export default _default;
}
declare module "lib/plugins/routify/index" {
    var _default: RoxiPlugin;
    export default _default;
    export namespace template {
        export { options as routify };
    }
    namespace options {
        const routifyDir: string;
        const dynamicImports: boolean;
        const singleBuild: any;
    }
}
declare module "lib/plugins/vite/utils" {
    export function matchesFile(relativePath: any): ({ id }: {
        id: any;
    }) => boolean;
    export function resolvePlugins(config: any): any;
}
declare module "lib/plugins/vite/index" {
    namespace _default {
        const name: string;
        const hooks: {
            event: string;
            condition: string;
            action: (app: any, params: any, ctx: any) => void;
        }[];
    }
    export default _default;
    export namespace template {
        const svite: {};
        namespace vite {
            const plugins: any[];
            namespace optimizeDeps {
                const include: string[];
            }
            const transforms: {
                test: ({ id }: {
                    id: any;
                }) => boolean;
                transform: ({ code }: {
                    code: any;
                }) => any;
            }[];
        }
    }
}
declare module "lib/plugins/spassr/index" {
    var _default: RoxiPlugin;
    export default _default;
    export namespace template {
        export { staticDir as assetsDir };
        export { template as entrypoint };
        export const inlineDynamicImports: boolean;
        export { port };
        export { host };
        export { script };
        export const ssr: boolean;
    }
    const staticDir: string;
    const template: string;
    const port: string;
    const host: string;
    const script: string;
}
type AppEvent = "end" | "start" | "router" | "*" | "init" | "config" | "before:config" | "after:config" | "before:bundle" | "bundle" | "after:bundle";
type RoxiPlugin = {
    name: string;
    hooks: RoxiPluginHook[];
    dependencies?: {
        [x: string]: Function;
    } | undefined;
};
type RoxiPluginHook = {
    event: AppEvent;
    name?: string | undefined;
    condition?: (RoxiPluginHookFunction | string) | undefined;
    action: RoxiPluginHookFunction;
};
type RoxiPluginHookFunction = (app: RoxiApp, params: {
    [x: string]: any;
}, ctx: {
    [x: string]: any;
}) => any;
type RoxiPluginConfig = {
    name: string;
    params: {
        [x: string]: any;
    };
};
type RoxiPluginConfigured = RoxiPlugin & RoxiPluginConfig;
type RoxiAppInstance = {
    events: ("end" | "start" | "router" | "*" | "init" | "config" | "before:config" | "after:config" | "before:bundle" | "bundle" | "after:bundle")[];
    state: {};
    log: {
        all: (msg: any) => void;
        debug: (msg: any) => void;
        info: (msg: any) => void;
        warn: (msg: any) => void;
        error: (msg: any) => void;
        fatal: (msg: any) => void;
        off: (msg: any) => void;
        trace: (msg: any) => void;
    };
    config: {};
    merge(obj: any): void;
    initiate(): Promise<void>;
    run(events?: ("end" | "start" | "router" | "*" | "init" | "config" | "before:config" | "after:config" | "before:bundle" | "bundle" | "after:bundle")[]): Promise<void>;
};
type RoxiApp = {
    events: ("end" | "start" | "router" | "*" | "init" | "config" | "before:config" | "after:config" | "before:bundle" | "bundle" | "after:bundle")[];
    state: {};
    log: {
        all: (msg: any) => void;
        debug: (msg: any) => void;
        info: (msg: any) => void;
        warn: (msg: any) => void;
        error: (msg: any) => void;
        fatal: (msg: any) => void;
        off: (msg: any) => void;
        trace: (msg: any) => void;
    };
    config: {};
    merge(obj: any): void;
    initiate(): Promise<void>;
    run(events?: ("end" | "start" | "router" | "*" | "init" | "config" | "before:config" | "after:config" | "before:bundle" | "bundle" | "after:bundle")[]): Promise<void>;
} & {
    config: Partial<RoxiAppConfig>;
};
type RoxiAppConfig = {
    rollup: import('./lib/plugins/rollup/rollup.template').default['template']['rollup'];
    routify: import('./lib/plugins/routify')['template']['routify'];
    roxi: import('./lib/roxi')['template']['roxi'];
    svite: import('./lib/plugins/vite')['template']['svite'];
    vite: import('./lib/plugins/vite')['template']['vite'];
    spassr: import('./lib/plugins/spassr')['template'];
};
declare module "roxi" {
    /** @type {RoxiPlugin} */
    export let RoxiPlugin: RoxiPlugin;
}
