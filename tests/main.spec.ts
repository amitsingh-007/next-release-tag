import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { resolvePreviousTag, run } from '../src/main';

const mocks = vi.hoisted(() => ({
  getInput: vi.fn<(name: string) => string>(),
  setOutput: vi.fn(),
  setFailed: vi.fn(),
  error: vi.fn(),
  fetchLatestMatchingTag: vi.fn(),
  fetchLatestReleaseTag: vi.fn(),
}));

vi.mock('@actions/core', () => ({
  getInput: mocks.getInput,
  setOutput: mocks.setOutput,
  setFailed: mocks.setFailed,
  error: mocks.error,
}));

vi.mock('../src/services/githubService', () => ({
  fetchLatestMatchingTag: mocks.fetchLatestMatchingTag,
  fetchLatestReleaseTag: mocks.fetchLatestReleaseTag,
}));

/** Route getInput('<name>') to the given values. */
const mockInputs = (inputs: Record<string, string>) => {
  mocks.getInput.mockImplementation((name: string) => inputs[name] ?? '');
};

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.resetAllMocks();
});

describe('resolvePreviousTag', () => {
  it('returns the previous_tag override verbatim when provided', async () => {
    mockInputs({ previous_tag: 'v99.99.99' });
    await expect(resolvePreviousTag('v')).resolves.toBe('v99.99.99');
    expect(mocks.fetchLatestReleaseTag).not.toHaveBeenCalled();
    expect(mocks.fetchLatestMatchingTag).not.toHaveBeenCalled();
  });

  it('returns the override even when the prefix is a wildcard', async () => {
    mockInputs({ previous_tag: 'v1.2.3' });
    await expect(resolvePreviousTag('v*')).resolves.toBe('v1.2.3');
    expect(mocks.fetchLatestMatchingTag).not.toHaveBeenCalled();
  });

  it('fetches the latest matching tag for a wildcard prefix', async () => {
    mockInputs({ previous_tag: '' });
    mocks.fetchLatestMatchingTag.mockResolvedValue('v1.2.3');
    await expect(resolvePreviousTag('v*')).resolves.toBe('v1.2.3');
    // Wildcard is stripped via extractTagPrefix before the API call.
    expect(mocks.fetchLatestMatchingTag).toHaveBeenCalledWith('v');
    expect(mocks.fetchLatestReleaseTag).not.toHaveBeenCalled();
  });

  it('fetches the latest release tag for a normal prefix', async () => {
    mockInputs({ previous_tag: '' });
    mocks.fetchLatestReleaseTag.mockResolvedValue('v1.2.3');
    await expect(resolvePreviousTag('v')).resolves.toBe('v1.2.3');
    expect(mocks.fetchLatestReleaseTag).toHaveBeenCalledTimes(1);
    expect(mocks.fetchLatestMatchingTag).not.toHaveBeenCalled();
  });
});

describe('run', () => {
  it('sets both outputs and logs on the happy path', async () => {
    vi.setSystemTime(new Date('2022-10-13'));
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    mockInputs({
      tag_prefix: 'v',
      tag_template: 'yy.mm.dd.i',
      previous_tag: 'v22.10.13.04',
    });

    await run();

    expect(mocks.setOutput).toHaveBeenCalledWith(
      'prev_release_tag',
      'v22.10.13.04'
    );
    expect(mocks.setOutput).toHaveBeenCalledWith(
      'next_release_tag',
      'v22.10.13.05'
    );
    expect(logSpy).toHaveBeenCalledWith('Previous Release Tag: v22.10.13.04');
    expect(logSpy).toHaveBeenCalledWith('New Release Tag: v22.10.13.05');
    expect(mocks.setFailed).not.toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('produces a first-release tag when no previous tag exists', async () => {
    vi.setSystemTime(new Date('2022-10-13'));
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
    mockInputs({ tag_prefix: 'v', tag_template: 'yy.mm.dd.i' });
    mocks.fetchLatestReleaseTag.mockResolvedValue(undefined);

    await run();

    expect(mocks.setOutput).toHaveBeenCalledWith('prev_release_tag', undefined);
    expect(mocks.setOutput).toHaveBeenCalledWith(
      'next_release_tag',
      'v22.10.13.01'
    );
    expect(mocks.setFailed).not.toHaveBeenCalled();
  });

  it('calls setFailed with the message when a template is missing', async () => {
    mockInputs({ tag_prefix: 'v', tag_template: '', previous_tag: 'v1.2.3' });

    await run();

    expect(mocks.setFailed).toHaveBeenCalledWith('Template not found');
    expect(mocks.setOutput).not.toHaveBeenCalled();
  });

  it('calls setFailed when the tag prefix is invalid', async () => {
    mockInputs({ tag_prefix: 'v**', tag_template: 'yy.mm.i' });

    await run();

    expect(mocks.setFailed).toHaveBeenCalledWith('Invalid tag prefix: v**');
    expect(mocks.setOutput).not.toHaveBeenCalled();
  });

  it('calls setFailed with the stringified value for a non-Error throw', async () => {
    mockInputs({ tag_prefix: 'v', tag_template: 'yy.mm.i' });
    mocks.fetchLatestReleaseTag.mockRejectedValue('boom');

    await run();

    expect(mocks.setFailed).toHaveBeenCalledWith(JSON.stringify('boom'));
    expect(mocks.error).not.toHaveBeenCalled();
    expect(mocks.setOutput).not.toHaveBeenCalled();
  });
});
