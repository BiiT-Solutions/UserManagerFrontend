import {Component, Input, OnInit} from '@angular/core';
import {User} from "authorization-services-lib";
import {BiitTableColumn, BiitTableData} from "biit-ui/table";

@Component({
  selector: 'biit-user-role-list',
  templateUrl: './user-role-list.component.html',
  styleUrls: ['./user-role-list.component.scss']
})
export class UserRoleListComponent implements OnInit {

  @Input() user: User;

  private static readonly DEFAULT_PAGE_SIZE: number = 10;
  private static readonly DEFAULT_PAGE: number = 1;
  protected readonly pageSizes: number[] = [10, 25, 50, 100];
  protected pageSize: number = UserRoleListComponent.DEFAULT_PAGE_SIZE;
  protected page: number = UserRoleListComponent.DEFAULT_PAGE_SIZE;
  protected columns: BiitTableColumn[] = [];
  protected loading: boolean = false;

  ngOnInit(): void {
  }

}
