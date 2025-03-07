import { PageEvent, Reflection, ReflectionKind, RenderTemplate } from 'typedoc';
import { MarkdownTheme } from 'typedoc-plugin-markdown/dist/theme';

/**
 * The MarkdownTheme is based on TypeDoc's DefaultTheme @see https://github.com/TypeStrong/typedoc/blob/master/src/lib/output/themes/DefaultTheme.ts.
 * - html specific components are removed from the renderer
 * - markdown specefic components have been added
 */

export default class NxMarkdownTheme extends MarkdownTheme {
  constructor(renderer) {
    super(renderer);
  }

  render(
    page: PageEvent<Reflection>,
    template: RenderTemplate<PageEvent<Reflection>>
  ): string {
    return (
      super
        .render(page, template)
        .replace(/\.md/gi, '')
        /**
         * Hack: This is the simplest way to update the urls and make them work
         * in the `/packages/[name]/documents/[index|ngcli_adapter] context.
         */
        .replace(/\/devkit\//gi, '/devkit/documents/')
    );
  }

  get mappings() {
    return [
      {
        kind: [ReflectionKind.Module],
        isLeaf: true,
        directory: '.',
        template: this.getReflectionTemplate(),
      },
      {
        kind: [ReflectionKind.Enum],
        isLeaf: false,
        directory: '.',
        template: this.getReflectionTemplate(),
      },
      {
        kind: [ReflectionKind.Class],
        isLeaf: false,
        directory: '.',
        template: this.getReflectionTemplate(),
      },
      {
        kind: [ReflectionKind.Interface],
        isLeaf: false,
        directory: '.',
        template: this.getReflectionTemplate(),
      },
      ...(this.allReflectionsHaveOwnDocument
        ? [
            {
              kind: [ReflectionKind.TypeAlias],
              isLeaf: true,
              directory: '.',
              template: this.getReflectionMemberTemplate(),
            },
            {
              kind: [ReflectionKind.Variable],
              isLeaf: true,
              directory: '.',
              template: this.getReflectionMemberTemplate(),
            },
            {
              kind: [ReflectionKind.Function],
              isLeaf: true,
              directory: '.',
              template: this.getReflectionMemberTemplate(),
            },
          ]
        : []),
    ];
  }

  /**
   * Returns the full url of a given mapping and reflection
   * @param mapping
   * @param reflection
   */
  toUrl(mapping, reflection) {
    return (
      (mapping.directory === '.' ? '' : mapping.directory + '/') +
      this.getUrl(reflection) +
      '.md'
    );
  }
}
