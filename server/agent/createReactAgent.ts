import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { ChatAnthropic } from '@langchain/anthropic';

const model = new ChatAnthropic({
  model: 'claude-3-5-sonnet-latest',
});

const agent = createReactAgent({
  llm: model,
  tools: [],
});
