// Telegram WebApp Integration Composable
// Provides reactive access to Telegram WebApp SDK features

import { ref, computed, onMounted, onUnmounted, markRaw, toRaw } from "vue";
import type { TelegramInitData } from "~/types/api";

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: TelegramInitData;
  version: string;
  platform: string;
  colorScheme: "light" | "dark";
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;
  BackButton: {
    isVisible: boolean;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
  };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive?: boolean) => void;
    hideProgress: () => void;
    setParams: (params: {
      text?: string;
      color?: string;
      text_color?: string;
      is_active?: boolean;
      is_visible?: boolean;
    }) => void;
  };
  HapticFeedback: {
    impactOccurred: (
      style: "light" | "medium" | "heavy" | "rigid" | "soft",
    ) => void;
    notificationOccurred: (type: "error" | "success" | "warning") => void;
    selectionChanged: () => void;
  };
  ready: () => void;
  expand: () => void;
  close: () => void;
  sendData: (data: string) => void;
  openLink: (url: string) => void;
  openTelegramLink: (url: string) => void;
  showPopup: (
    params: {
      title?: string;
      message: string;
      buttons?: Array<{ id?: string; type?: string; text?: string }>;
    },
    callback?: (buttonId: string) => void,
  ) => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (
    message: string,
    callback?: (confirmed: boolean) => void,
  ) => void;
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export function useTelegramWebApp() {
  const isReady = ref(false);
  const isTelegramWebApp = ref(false);
  const webApp = ref<TelegramWebApp | null>(null);

  // User data
  const user = computed(() => {
    if (!webApp.value) return null;
    return webApp.value.initDataUnsafe.user || null;
  });

  const userId = computed(() => user.value?.id || null);
  const userFirstName = computed(() => user.value?.first_name || "");
  const userLastName = computed(() => user.value?.last_name || "");
  const username = computed(() => user.value?.username || "");
  const languageCode = computed(() => user.value?.language_code || "ru");

  // Theme data
  const colorScheme = computed(() => webApp.value?.colorScheme || "light");
  const themeParams = computed(() => webApp.value?.themeParams || {});
  const isDarkMode = computed(() => colorScheme.value === "dark");

  // Platform data
  const platform = computed(() => webApp.value?.platform || "unknown");
  const version = computed(() => webApp.value?.version || "6.0");

  // Viewport data
  const viewportHeight = computed(() => webApp.value?.viewportHeight || 0);
  const isExpanded = computed(() => webApp.value?.isExpanded || false);

  // Init data for backend validation
  const initData = computed(() => webApp.value?.initData || "");
  const initDataUnsafe = computed(() => webApp.value?.initDataUnsafe || {});

  /**
   * Initialize Telegram WebApp
   */
  const initialize = () => {
    if (typeof window === "undefined") return;

    const tg = window.Telegram?.WebApp;

    if (tg) {
      webApp.value = tg;
      isTelegramWebApp.value = true;

      // Initialize WebApp
      tg.ready();

      // Expand to full height
      tg.expand();

      // Enable closing confirmation (optional)
      // tg.enableClosingConfirmation()

      isReady.value = true;

      console.log("Telegram WebApp initialized", {
        version: tg.version,
        platform: tg.platform,
        colorScheme: tg.colorScheme,
        user: tg.initDataUnsafe.user,
      });
    } else {
      console.warn("Not running in Telegram WebApp environment");
      isTelegramWebApp.value = false;
      isReady.value = true;
    }
  };

  /**
   * Apply Telegram theme colors to CSS variables
   */
  const applyTheme = () => {
    if (!webApp.value || typeof document === "undefined") return;

    const theme = webApp.value.themeParams;
    const root = document.documentElement;

    if (theme.bg_color)
      root.style.setProperty("--tg-theme-bg-color", theme.bg_color);
    if (theme.text_color)
      root.style.setProperty("--tg-theme-text-color", theme.text_color);
    if (theme.hint_color)
      root.style.setProperty("--tg-theme-hint-color", theme.hint_color);
    if (theme.link_color)
      root.style.setProperty("--tg-theme-link-color", theme.link_color);
    if (theme.button_color)
      root.style.setProperty("--tg-theme-button-color", theme.button_color);
    if (theme.button_text_color)
      root.style.setProperty(
        "--tg-theme-button-text-color",
        theme.button_text_color,
      );
    if (theme.secondary_bg_color)
      root.style.setProperty(
        "--tg-theme-secondary-bg-color",
        theme.secondary_bg_color,
      );

    // Apply dark mode class
    if (colorScheme.value === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      root.setAttribute("data-theme", "light");
    }
  };

  /**
   * Show main button
   */
  const showMainButton = (text: string, onClick: () => void) => {
    if (!webApp.value) return;

    const tg = toRaw(webApp.value);
    tg.MainButton.setText(text);
    tg.MainButton.onClick(onClick);
    tg.MainButton.show();
  };

  /**
   * Hide main button
   */
  const hideMainButton = () => {
    if (!webApp.value) return;
    const tg = toRaw(webApp.value);
    tg.MainButton.hide();
  };

  /**
   * Update main button
   */
  const updateMainButton = (params: {
    text?: string;
    color?: string;
    textColor?: string;
    isActive?: boolean;
    isVisible?: boolean;
  }) => {
    if (!webApp.value) return;

    const tg = toRaw(webApp.value);
    tg.MainButton.setParams({
      text: params.text,
      color: params.color,
      text_color: params.textColor,
      is_active: params.isActive,
      is_visible: params.isVisible,
    });
  };

  /**
   * Show back button
   */
  const showBackButton = (onClick: () => void) => {
    if (!webApp.value) return;

    const tg = toRaw(webApp.value);
    tg.BackButton.onClick(onClick);
    tg.BackButton.show();
  };

  /**
   * Hide back button
   */
  const hideBackButton = () => {
    if (!webApp.value) return;
    const tg = toRaw(webApp.value);
    tg.BackButton.hide();
  };

  /**
   * Show alert dialog
   */
  const showAlert = (message: string): Promise<void> => {
    return new Promise((resolve) => {
      if (!webApp.value) {
        alert(message);
        resolve();
        return;
      }

      const tg = toRaw(webApp.value);
      tg.showAlert(message, () => {
        resolve();
      });
    });
  };

  /**
   * Show confirm dialog
   */
  const showConfirm = (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!webApp.value) {
        const result = confirm(message);
        resolve(result);
        return;
      }

      const tg = toRaw(webApp.value);
      tg.showConfirm(message, (confirmed) => {
        resolve(confirmed);
      });
    });
  };

  /**
   * Show popup with custom buttons
   */
  const showPopup = (params: {
    title?: string;
    message: string;
    buttons?: Array<{ id?: string; type?: string; text?: string }>;
  }): Promise<string> => {
    return new Promise((resolve) => {
      if (!webApp.value) {
        alert(params.message);
        resolve("ok");
        return;
      }

      const tg = toRaw(webApp.value);
      tg.showPopup(params, (buttonId) => {
        resolve(buttonId);
      });
    });
  };

  /**
   * Haptic feedback - impact
   */
  const hapticImpact = (
    style: "light" | "medium" | "heavy" | "rigid" | "soft" = "medium",
  ) => {
    if (!webApp.value) return;
    const tg = toRaw(webApp.value);
    tg.HapticFeedback.impactOccurred(style);
  };

  /**
   * Haptic feedback - notification
   */
  const hapticNotification = (type: "error" | "success" | "warning") => {
    if (!webApp.value) return;
    const tg = toRaw(webApp.value);
    tg.HapticFeedback.notificationOccurred(type);
  };

  /**
   * Haptic feedback - selection changed
   */
  const hapticSelection = () => {
    if (!webApp.value) return;
    const tg = toRaw(webApp.value);
    tg.HapticFeedback.selectionChanged();
  };

  /**
   * Open external link
   */
  const openLink = (url: string) => {
    if (!webApp.value) {
      window.open(url, "_blank");
      return;
    }
    const tg = toRaw(webApp.value);
    tg.openLink(url);
  };

  /**
   * Open Telegram link
   */
  const openTelegramLink = (url: string) => {
    if (!webApp.value) {
      window.open(url, "_blank");
      return;
    }
    const tg = toRaw(webApp.value);
    tg.openTelegramLink(url);
  };

  /**
   * Close WebApp
   */
  const close = () => {
    if (!webApp.value) {
      window.close();
      return;
    }
    const tg = toRaw(webApp.value);
    tg.close();
  };

  /**
   * Send data to bot
   */
  const sendData = (data: any) => {
    if (!webApp.value) return;

    const dataString = typeof data === "string" ? data : JSON.stringify(data);
    const tg = toRaw(webApp.value);
    tg.sendData(dataString);
  };

  // Initialize on mount
  onMounted(() => {
    initialize();
    applyTheme();
  });

  // Cleanup on unmount
  onUnmounted(() => {
    if (webApp.value) {
      const tg = toRaw(webApp.value);
      tg.MainButton.hide();
      tg.BackButton.hide();
    }
  });

  return {
    // State
    isReady,
    isTelegramWebApp,
    webApp,

    // User data
    user,
    userId,
    userFirstName,
    userLastName,
    username,
    languageCode,

    // Theme
    colorScheme,
    themeParams,
    isDarkMode,

    // Platform
    platform,
    version,
    viewportHeight,
    isExpanded,

    // Init data
    initData,
    initDataUnsafe,

    // Methods
    initialize,
    applyTheme,
    showMainButton,
    hideMainButton,
    updateMainButton,
    showBackButton,
    hideBackButton,
    showAlert,
    showConfirm,
    showPopup,
    hapticImpact,
    hapticNotification,
    hapticSelection,
    openLink,
    openTelegramLink,
    close,
    sendData,
  };
}
