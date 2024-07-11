import handlebars from 'handlebars';

export interface TemplateVariable {
  [key: string]: string | number;
}

export interface ParseMailTemplateDTO {
  template: string;
  variables: TemplateVariable;
}

export default class HandlebarsMailTemplate {
  public async parse({
    template,
    variables,
  }: ParseMailTemplateDTO): Promise<string> {
    const parseTemplate = handlebars.compile(template);

    return parseTemplate(variables);
  }
}
