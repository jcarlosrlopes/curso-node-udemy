import handlebars from 'handlebars';
import fs from 'fs';

export interface TemplateVariable {
  [key: string]: string | number;
}

export interface ParseMailTemplateDTO {
  file: string;
  variables: TemplateVariable;
}

export default class HandlebarsMailTemplate {
  public async parse({
    file,
    variables,
  }: ParseMailTemplateDTO): Promise<string> {
    const templateFileContent = await fs.promises.readFile(file, {
      encoding: 'utf-8',
    });
    const parseTemplate = handlebars.compile(templateFileContent);

    return parseTemplate(variables);
  }
}
