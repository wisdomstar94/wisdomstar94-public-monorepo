import { getCommonTailwindConfig } from "../../libs/packages-common-lib/src/configs/tailwind.common.config";

const config = getCommonTailwindConfig({
  corePlugins: {
    preflight: false,
  },
});
export default config;
