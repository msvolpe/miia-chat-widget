import { ChatPlugin, ChatMessage } from '../types';

export class PluginManager {
  private plugins: ChatPlugin[] = [];

  constructor(plugins: ChatPlugin[] = []) {
    this.plugins = plugins;
  }

  async init(): Promise<void> {
    for (const plugin of this.plugins) {
      if (plugin.onInit) {
        try {
          await plugin.onInit();
        } catch (error) {
          console.error(`Plugin "${plugin.name}" initialization failed:`, error);
        }
      }
    }
  }

  async beforeSend(message: string): Promise<string> {
    let result = message;
    
    for (const plugin of this.plugins) {
      if (plugin.onBeforeMessageSent) {
        try {
          result = await plugin.onBeforeMessageSent(result);
        } catch (error) {
          console.error(`Plugin "${plugin.name}" beforeSend failed:`, error);
          // Continue with the current result even if a plugin fails
        }
      }
    }
    
    return result;
  }

  async afterReceive(message: ChatMessage): Promise<ChatMessage> {
    let result = message;
    
    for (const plugin of this.plugins) {
      if (plugin.onAfterMessageReceived) {
        try {
          result = await plugin.onAfterMessageReceived(result);
        } catch (error) {
          console.error(`Plugin "${plugin.name}" afterReceive failed:`, error);
          // Continue with the current result even if a plugin fails
        }
      }
    }
    
    return result;
  }

  onError(error: Error): void {
    for (const plugin of this.plugins) {
      if (plugin.onError) {
        try {
          plugin.onError(error);
        } catch (err) {
          console.error(`Plugin "${plugin.name}" onError handler failed:`, err);
        }
      }
    }
  }

  addPlugin(plugin: ChatPlugin): void {
    this.plugins.push(plugin);
  }

  removePlugin(pluginName: string): void {
    this.plugins = this.plugins.filter(p => p.name !== pluginName);
  }

  getPlugins(): ChatPlugin[] {
    return [...this.plugins];
  }
}
