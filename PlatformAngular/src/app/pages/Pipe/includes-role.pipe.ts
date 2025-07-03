import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'includesRole',
  standalone: true
})
export class IncludesRolePipe implements PipeTransform {

  transform(roles: string[] | null | undefined, keywords: string | string[]): boolean {
    const rolesArray = Array.isArray(roles) ? roles : [roles];
    const keywordArray = Array.isArray(keywords) ? keywords : [keywords];
    return rolesArray.some(role =>
      keywordArray.some(keyword =>
        role?.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  }

}
