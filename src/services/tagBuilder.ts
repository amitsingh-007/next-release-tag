class TagBuilder {
  private static format(value: number) {
    return value < 10 ? `0${value}` : `${value}`;
  }

  private tagTemplate: string;
  private prefix: string | undefined;

  constructor(tagTemplate: string) {
    this.tagTemplate = `${tagTemplate}`; // Deep copy
  }

  public inject(templatePart: string, value: number) {
    this.tagTemplate = this.tagTemplate.replaceAll(
      templatePart,
      TagBuilder.format(value)
    );
    return this;
  }

  public addPrefix(prefix: string) {
    this.prefix = prefix;
    return this;
  }

  public build() {
    if (!this.prefix) {
      return this.tagTemplate;
    }

    return `${this.prefix}${this.tagTemplate}`;
  }
}

export default TagBuilder;
