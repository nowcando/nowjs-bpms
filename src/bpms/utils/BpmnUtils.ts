// tslint:disable: no-var-requires
const bpe = require("bpmn-elements");
const types = bpe;
import BpmnModdle from "bpmn-moddle";
const Debug = require("debug");
const mcs = require("moddle-context-serializer");
const {default: Serializer , TypeResolver} = mcs;
const { Context, Environment } = types;
// import {Scripts} from "bpmn-elements/JavaScripts";
const Scripts = () => {
  // tslint:disable-next-line: no-console
  console.log("Script is loaded");
};



export default {
  context,
  emptyContext,
  moddleContext,
  Logger,
};

async function context(source, ...args) {
  const logger = Logger("test-helpers:context");

  const [options, callback] = getOptionsAndCallback(...args);
  logger.debug("moddle context load");
  const moddleCtx = await moddleContext(source, options.moddleOptions);
  logger.debug("moddle context complete");
  const typeResolver = TypeResolver({...types, ...options.elements});
  const serializer = Serializer(moddleCtx, typeResolver);

  const extensions =
    options &&
    options.extensions &&
    Object.keys(options.extensions).reduce((result, name) => {
      const extension = options.extensions[name];
      if (extension) {
        result[name] = extension;
      }
      return result;
    }, {});

  const ctx = Context(
    serializer,
    Environment({
      Logger,
      scripts: Scripts(),
      settings: { enableDummyService: true },
      ...options,
      extensions,
    }),
  );
  logger.debug("context complete");
  if (callback) {
    callback(null, ctx);
  }

  return ctx;
}

function moddleContext(source: Buffer|string, options: any = {}) {
  const moddleOptions = options;
    // options.extensions &&
    // Object.keys(options.extensions).reduce((result, ext) => {
    //   result[ext] = options.extensions[ext].moddleOptions;
    //   return result;
    // }, {});

  const bpmnModdle = new BpmnModdle(moddleOptions);

  return new Promise((resolve, reject) => {
    bpmnModdle.fromXML(
      Buffer.isBuffer(source) ? source.toString() : source.trim(),
      (err, definitions, moddleCtx) => {
        if (err) {
          return reject(err);
        }
        resolve(moddleCtx);
      },
    );
  });
}

export function Logger(scope) {
  return {
    debug: Debug("bpmn-elements:" + scope),
    error: Debug("bpmn-elements:error:" + scope),
    warn: Debug("bpmn-elements:warn:" + scope),
  };
}

function emptyContext(override, options) {
  return Context(
    {
      // tslint:disable: no-empty
      getActivities() {},
      getAssociations() {},
      getInboundAssociations() {},
      getInboundSequenceFlows() {},
      getMessageFlows() {},
      getOutboundSequenceFlows() {},
      getSequenceFlows() {},
      ...override,
    },
    Environment({
      Logger,
      scripts: Scripts(),
      settings: { enableDummyService: true },
      ...options,
    }),
  );
}

function getOptionsAndCallback(
  optionsOrCallback?: any,
  callback?: any,
  defaultOptions?: any,
) {
  let options;
  if (typeof optionsOrCallback === "function") {
    callback = optionsOrCallback;
    options = defaultOptions;
  } else {
    options = defaultOptions
      ? Object.assign(defaultOptions, optionsOrCallback)
      : optionsOrCallback;
  }

  return [options, callback];
}
