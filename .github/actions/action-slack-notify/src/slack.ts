import { WebClient } from '@slack/web-api';

export class Slack {
  readonly client: WebClient;
  readonly channel: string;
  readonly username: string;

  constructor(token: string, channel: string, username: string) {
    this.client = new WebClient(token);
    this.channel = channel;
    this.username = username;
  }
}
