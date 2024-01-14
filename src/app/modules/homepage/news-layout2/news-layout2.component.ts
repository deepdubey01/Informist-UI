import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, ElementRef, Input, NO_ERRORS_SCHEMA, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalConfig, NgbModalRef, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from 'src/app/api.service';
import { AuthenticationService } from 'src/app/authentication.service';
import { ConfirmationDialogComponent } from '../../admin-lte/mat-design/confirmation-dialog/confirmation-dialog.component';
import { untilDestroyed } from '@ngneat/until-destroy';
import { delay, filter } from 'rxjs';
import { NgForm } from '@angular/forms';
import { UpdatePasswordComponent } from 'src/app/user-auth/update-password/update-password.component';
import { SharedService } from 'src/app/service/shared.service';
import { SettingComponent } from '../setting/setting.component';
import { NewsService } from 'src/app/service/news.service';
import { ContextMenuComponent } from 'src/app/module/context-menu/context-menu.component';
import { CdkConnectedOverlay } from '@angular/cdk/overlay';
import { FilterPanelComponent } from '../filter-panel/filter-panel.component';
import { HttpClient } from '@angular/common/http';
import { main } from '@popperjs/core';

interface Item {
  value: string;
  text: string;
}




declare function ConnectToServer(): any;
declare function RequestStory(strStoryId: any): any;
declare function RequestNews(strNewsWire: string, symbol: string, TestElement: string): any;
declare function RequestSearchNews(strNewsWire: string, symbol: string, TestElement: string, requestedBy: boolean, user_id: any): any;
declare function SerchNewsImage(tableName: string): any;
declare function clearTableRows(tableName: any): any;
declare function Authenticate(user_id: any, accessToken: string): any;
declare function requestMenuDetails(user_id: any, accessToken: string, wire: string): any;
declare var informistHub: any;
declare var $: any;
declare var activatedLayout: any;
declare var MainPermission: any;

@Component({
  selector: 'app-news-layout2',
  templateUrl: './news-layout2.component.html',
  styleUrls: ['./news-layout2.component.css']
})
export class NewsLayout2Component {

  private wireMappings: { [key: string]: string } = {
  };


  @ViewChild('contextMenu', { static: false }) contextMenu: ContextMenuComponent | undefined;
  private contextMenuEvent: MouseEvent | undefined;
  selectedOptions: { [key: string]: { [key: string]: boolean } } = {
    'newsTable': {},
    'newsTable2': {}
  };

  CMWmenuFileName: any = 'CMW-Menu.json';
  CEWmenuFileName: any = 'CEW-Menu.json';

  private modalReference: NgbModalRef | null;
  isMenuOpen = false;
  isSubmenuOpen = false;
  access_token: any;
  searchTable: string = 'searchTable';
  filteredForm: string = 'filteredForm';
  isSidebarOpen: boolean = false;
  isSocketDisconnected: boolean = false;
  errorMessage: string = '';

  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  @Input() userId: string | null = null;
  isLoginPage: boolean = true;
  newsData: any[] = [];
  selectedNews: {
    dateTime: string;
    headline: string;
    description: string;
    category: string;
    notes: string;
    categoryCode: string;
  } | null = null;

  userData: any;
  isUserLoggedIn: boolean = false;
  isdashboard: boolean = true;
  closeResult = '';
  activatedTable: any;
  isRealLoginPage: boolean = true;
  isSubscribePage: boolean = true;
  isHomePage: boolean = true;
  user_id: any;
  wire: string = '';
  category: string = '';
  headline: string = '';
  mainwire: string = '';
  storytext: string = '';
  companySymbol: string = '';
  notificationData: any;
  isToastVisible: boolean = false;
  notification: any;
  notificationCount: any;
  connectionToken: string = '';
  currentIndex = 0;
  latestNewsStoryContent: string = '';
  responseData: any[] = [];
  permittedwires: any;

  newsTableheadline: string = 'Headlines';
  newsTableheadline2: string = 'Headlines';


  subscribeResponseData: any[] = [];
  subscribepaidResponseData: any[] = [];
  subscribetrialResponseData: any[] = [];
  trialsubscription_until: string = '';
  trialtotal_amt: number = 0;
  trialsubscription_type: string = '';
  allWirePackageCodes: any;
  paidsubscription_until: string = 'dd/mm/yyyy';
  paidtotal_amt: number = 0;
  paidsubscription_type: string = 'Paid';
  subscriptionData: any;
  subscriptionError: string = '';
  cartEmpty: boolean = false;
  old_password: any = '';
  new_password: any = '';
  confirm_password: any = '';
  signUpData = {
    old_password: '',
    new_password: '',
    confirm_password: '',
  };
  wirePermission: any[] = [];
  message: string = '';
  jsonData: any;
  MainUserPreference: any;
  constructor(private router: Router,
    private authService: AuthenticationService,
    private productService: ProductService,
    private dialog: MatDialog,
    private newsService: NewsService,
    private renderer: Renderer2,
    private NgbOffcanvas: NgbOffcanvas,
    private http: HttpClient,
    private el: ElementRef,
    private observer: BreakpointObserver,
    public sharedservice: SharedService,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private cd: ChangeDetectorRef) {
    config.backdrop = 'static';
    config.keyboard = false;
    this.modalReference = null;
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = this.router.url;
        this.isRealLoginPage = url.endsWith('/login') || url.endsWith('signup');
        this.isLoginPage = url.endsWith('/');
        this.isdashboard = url.endsWith('/');
        this.isHomePage = url.endsWith('/index');
        this.isSubscribePage =
          url.endsWith('/') ||
          url.endsWith('/login') ||
          url.endsWith('forgot-password') ||
          url.endsWith('reset-password');
        this.isUserLoggedIn = this.authService.isUserLoggedIn();
      }
    });


  }

  permittedWiresString: any;
  toggleValue: boolean = false;
  ngOnInit(): void {
    this.access_token = this.authService.getToken() || '';
    this.user_id = this.authService.getUserId();
    ConnectToServer();
    const accessToken = this.authService.getToken() || '';
    this.user_id = this.authService.getUserId();
    setTimeout(() => {
      Authenticate(this.user_id, accessToken);
    }, 2000);

    setTimeout(() => {
      this.permittedWiresString = window.localStorage.getItem("MainPermissionwires");
      this.MainUserPreference = window.localStorage.getItem("MainUserPreference");
      if (this.MainUserPreference) {
        try {
          const userPreferenceData = this.MainUserPreference
          const permittedWires = JSON.parse(this.permittedWiresString);
          const packageCodes = [...new Set(permittedWires.map((item: { subpackagecode: any; }) => item.subpackagecode))];

          this.permittedwires = packageCodes.join(',');
          this.allWirePackageCodes = packageCodes;
          const groupedNews = permittedWires.reduce((result: { [key: string]: any[] }, item: { subpackagecode: string | number }) => {
            if (!result[item.subpackagecode]) {
              result[item.subpackagecode] = [];
            }
            result[item.subpackagecode].push(item);
            return result;
          }, {});
          for (const packageCode in groupedNews) {
            if (groupedNews.hasOwnProperty(packageCode)) {
              const newsItems = groupedNews[packageCode];
              this.wirePermission.push(newsItems[0]);

              this.wireMappings = this.wirePermission.reduce((result, item) => {
                result[item.subpackagecode] = item.sub_package_name;
                return result;
              }, {});
            }
          }


        } catch (error) {
          console.error("Error parsing JSON from MainUserPreference:", error);
        }
      }
      else {
        console.log("MainUserPreference is empty.");
        if (this.permittedWiresString) {
          this.wirePermission = [];
          this.permittedwires = '';
          try {
            const permittedWires = JSON.parse(this.permittedWiresString);
            const packageCodes = [...new Set(permittedWires.map((item: { subpackagecode: any; }) => item.subpackagecode))];
            this.permittedwires = packageCodes.join(',');
            this.allWirePackageCodes = packageCodes;
            const groupedNews = permittedWires.reduce((result: { [key: string]: any[] }, item: { subpackagecode: string | number }) => {
              if (!result[item.subpackagecode]) {
                result[item.subpackagecode] = [];
              }
              result[item.subpackagecode].push(item);
              return result;
            }, {});

            for (const packageCode in groupedNews) {
              if (groupedNews.hasOwnProperty(packageCode)) {
                const newsItems = groupedNews[packageCode];
                this.wirePermission.push(newsItems[0]);

                this.wireMappings = this.wirePermission.reduce((result, item) => {
                  result[item.subpackagecode] = item.sub_package_name;
                  return result;
                }, {});
              }
            }
          } catch (error) {
            console.error("Error processing permitted wires:", error);
          }

          const packageCodes = this.permittedwires.split(',');
          if (packageCodes.length === 1) {
            const formattedCode = `@${packageCodes[0]}`;
            RequestSearchNews(formattedCode, "", "newsTable", true, this.user_id);
            this.newsTableheadline = formattedCode;
            RequestSearchNews(formattedCode, "", "newsTable2", true, this.user_id);
            this.newsTableheadline2 = formattedCode;
          } else {
            for (let i = 0; i < packageCodes.length; i++) {
              const formattedCode = `@${packageCodes[i]}`;
              if (i % 2 === 0) {
                RequestSearchNews(formattedCode, "", "newsTable", true, this.user_id);
                this.newsTableheadline = formattedCode;
              } else {
                RequestSearchNews(formattedCode, "", "newsTable2", true, this.user_id);
                this.newsTableheadline2 = formattedCode;
              }
            }
          }
        }
      }

      this.newsService.newsData$.subscribe((data) => {
        this.newsData = data;
      });

    }, 5000)


    if (this.authService.isUserLoggedIn()) {
      const notificationDataString = localStorage.getItem('notificationData');
      const notificationCountString = localStorage.getItem('notificationCount');

      if (notificationDataString) {
        this.notificationData = JSON.parse(notificationDataString);
      }

      if (notificationCountString) {
        this.notificationCount = parseInt(notificationCountString, 10);
      }
      this.isUserLoggedIn = true;
    }

    this.productService.getNotification().subscribe(
      (response) => {
        const notificationDataString = JSON.stringify(response.data);
        localStorage.setItem('notificationData', notificationDataString);
      }
    );

    this.productService.subscriptionList().subscribe(
      (subscriptionResponse) => {
        if (subscriptionResponse.code === 200) {
          this.subscribeResponseData = subscriptionResponse.data.response;
          if (subscriptionResponse.data.response.length === 0) {
            window.location.href = 'free-trial-select-wire';
            localStorage.setItem('subscription_type', 'TRIAL');
          } else {

            localStorage.setItem('subscription_type', 'PAID');
          }
        }
      },
      (error) => {
        window.location.href = 'free-trial-select-wire';
      }
    );


    this.sharedservice.selectTheme();
  }


  private createNewsRow(newsData: any): HTMLElement {
    const newRow = this.renderer.createElement('tr');
    const cell1 = this.renderer.createElement('td');
    const cell2 = this.renderer.createElement('td');

    this.renderer.appendChild(cell1, this.renderer.createText(newsData.storydate));
    this.renderer.appendChild(cell2, this.renderer.createText(newsData.headline));

    this.renderer.appendChild(newRow, cell1);
    this.renderer.appendChild(newRow, cell2);

    return newRow;
  }

  toggleAccordion(event: Event) {
    const accordionHeader = event.currentTarget as HTMLElement;
    accordionHeader.classList.toggle('active');
    const accordionContent = accordionHeader.nextElementSibling as HTMLElement;
    accordionContent.style.display = accordionContent.style.display === 'block' ? 'none' : 'block';
  }

  logout() {
    const modalRef = this.modalService.open(ConfirmationDialogComponent, {
      size: 'md', centered: true
    });
    modalRef.componentInstance.message = 'Do you want to logout..?';

    modalRef.result.then((result) => {
      if (result === true) {
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    });
  }

  RequestStory(storyno: any) {
    this.RequestStory(storyno);
  }

  open() {
    this.modalService.open(SettingComponent, { ariaLabelledBy: 'modal-basic-title', scrollable: true, size: 'lg' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  openSearchPanel(tableName: any, searchbox: any) {
    this.activatedTable = tableName;
    const storedData = JSON.parse(window.localStorage.getItem('requestNews') || '');
    const storedDataString = window.localStorage.getItem('requestNews');
    if (storedDataString) {
      try {
        const storedData = JSON.parse(storedDataString);
        if (Object.keys(storedData).length > 0) {
          for (const tableName in storedData) {
            const { strNewsWire, strkeyword } = storedData[tableName];
            const safeStrKeyword = strkeyword || '';

            if (tableName === this.activatedTable) {
              this.category = '';
              this.mainwire = strNewsWire;
              this.mainwire = this.mainwire.replace('@', '');
              requestMenuDetails(this.user_id, this.access_token, this.mainwire);
              break;
            }
          }
        }
      } catch (error) {
        console.error("Error parsing JSON from localStorage:", error);
      }
    } else {
      RequestNews("@CMW", "", "newsTable");
      RequestNews("@CEW", "", "newsTable2");
    }
    this.modalService.open(searchbox, {
      ariaLabelledBy: 'modal-basic-title', windowClass: 'fade-in-modal', size: 'xl', centered: true
    }).result.then(
      (result) => {

        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }


  profileOpen(profile: any) {
    this.productService.userProfile().subscribe(
      (response) => {
        if (response.error == 1) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        this.userData = response.data;
      }
    );

    this.modalService.open(profile, { ariaLabelledBy: 'modal-basic-title', scrollable: true, size: 'xl' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }


  openOffCanva(topOffCanvas: any) {
    this.modalService.open(topOffCanvas, { size: 'xl', ariaLabelledBy: 'modal-basic-title', scrollable: true }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  EditProfileOpen(profileEdit: any) {
    this.productService.userProfile().subscribe(
      (response) => {
        if (response.error == 1) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        this.userData = response.data;
      }
    );

    this.modalService.open(profileEdit, { ariaLabelledBy: 'modal-basic-title', scrollable: true, size: 'xl' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  subscriptionOpen(subscription: any) {

    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach((header) => {
      header.addEventListener('click', () => {
        header.classList.toggle('active');
        const accordionContent = header.nextElementSibling as HTMLElement;

        if (accordionContent.style.display === 'block') {
          accordionContent.style.display = 'none';
        } else {
          accordionContent.style.display = 'block';
        }
      });
    });
    this.modalService.open(subscription, { ariaLabelledBy: 'modal-basic-title', scrollable: true, size: 'xl', }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  ngAfterViewInit() {

    function formatDateTime(dateTimeString: string) {
      const options = { hour: '2-digit', minute: '2-digit', hour12: true } as Intl.DateTimeFormatOptions;
      return new Date(dateTimeString).toLocaleTimeString(undefined, options);
    }
    const dateCells = document.querySelectorAll('.table tbody tr td:first-child');
    dateCells.forEach((cell) => {
      const originalDateTime = cell.textContent!;
      const formattedDateTime = formatDateTime(originalDateTime);

      cell.textContent = formattedDateTime;

      cell.setAttribute('title', originalDateTime);
    });


    this.observer
      .observe(['(max-width: 800px)'])
      .pipe(delay(1), untilDestroyed(this))
      .subscribe((res) => {
        if (res.matches) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
      });

    this.router.events
      .pipe(
        untilDestroyed(this),
        filter((e: any) => e instanceof NavigationEnd)
      )
      .subscribe(() => {
        if (this.sidenav.mode === 'over') {
          this.sidenav.close();
        }
      });
  }

  onSaveChanges(form: NgForm,) {
    if (form.valid) {
      const formData = {
        user_id: this.user_id,
        mobile_no: form.value['mobile-number'] || 0,
        email_id: form.value.email || 'string',
        status: 'ACTIVE',
        fname: form.value.fname || 'string',
        lname: form.value.lname || 'string',
        city: form.value.city || 'string',
        country_id: form.value['country_id'] || 0
      };

      this.productService.updateProfile(formData).subscribe(
        (response) => {
          if (response.code === 200 && this.modalReference) {
            this.modalReference.close();
          }
        }
      );
    }
  }

  changePasswordOpen() {
    this.modalService.open(UpdatePasswordComponent, { ariaLabelledBy: 'modal-basic-title', scrollable: false, size: 'md', }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  toggleSubmenu(event: Event) {
    event.preventDefault();
    this.isSubmenuOpen = !this.isSubmenuOpen;
  }

  signUp(signUpForm: NgForm) {
    this.errorMessage = '';
    if (signUpForm.value.mobile_no == '' && signUpForm.value.email_id == '' && signUpForm.value.password == '') {
      this.errorMessage = 'Please fill all details..!!';
    }
  }

  loadNewsDetails(storyno: any) {
    RequestStory(storyno);
  }


  toggleMenuOpen() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  reloadPage() {
    const currentRouteUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentRouteUrl]);
    });
  }
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  openContextMenu(event: MouseEvent) {
    event.preventDefault();
    // this.ContextMenuService.triggerContextMenu(event);
  }


  onSearchNews(searchForm: NgForm) {
    const wireValue = searchForm.value.wire;
    const categoryValue = searchForm.value.category;
    const headlineValue = searchForm.value.headline;
    const storytextValue = searchForm.value.storytext;
    const companySymbolValue = searchForm.value.companySymbol;
    if (wireValue || categoryValue || headlineValue || storytextValue || companySymbolValue) {
      this.errorMessage = '';

      const wireArray = wireValue.replace(/[,\s]+/g, '@').split('@');
      wireArray.forEach((wire: any) => {
        RequestSearchNews(`@${wire}@`, categoryValue, this.searchTable, true, this.user_id);
      });


      // informistHub.client.onNewsImage = function (rwire: any, response: string) {
      //   console.log(response);
      //   var newsDataItems = JSON.parse(response);
      //   // var table = document.querySelector(`.${tableName}`).getElementsByTagName('tbody')[0];
      //   // for (var i = newsDataItems.length - 1; i >= 0; i--) {
      //   //   addTableRow(table, newsDataItems[i]);
      //   // }
      // }


    } else {
      this.errorMessage = 'Please specify your request by typing it out.';
    }
  }


  onFilteredNews(filteredForm: NgForm) {
    const selectedWire = this.mainwire;
    const categoryValue = localStorage.getItem('category_Selection') || '';
    console.log('this.mainwire: ' + this.mainwire);
    console.log('categoryValue: ' + categoryValue);
    if (this.activatedTable == 'newsTable') {
      this.newsTableheadline = this.wireMappings[selectedWire] || this.newsTableheadline;
    } else if (this.activatedTable == 'newsTable2') {
      this.newsTableheadline2 = this.wireMappings[selectedWire] || this.newsTableheadline2;
    }

    if (categoryValue || selectedWire) {
      this.errorMessage = '';
      RequestSearchNews(`@${selectedWire}`, categoryValue, this.activatedTable, true, this.user_id);
      localStorage.removeItem('category_Selection');
    } else {
      this.errorMessage = 'Please specify your request by typing it out.';
    }
  }


  downloadCSV() {
    const table = document.getElementById("newsTable");
    if (!table) {
      console.error("Table not found.");
      return;
    }
    const rows = Array.from(table.querySelectorAll("tbody tr"));
    if (!rows.length) {
      console.warn("No data to export.");
      return;
    }
    const csv = [];
    for (const row of rows) {
      const rowData = [];
      const cells = Array.from(row.querySelectorAll("td"));
      for (const cell of cells) {
        rowData.push(cell.textContent);
      }
      csv.push(rowData.join(","));
    }
    const csvContent = csv.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsData.csv";
    a.click();
  }

  showContextMenu(event: MouseEvent) {

    event.preventDefault();

    if (this.contextMenu) {
      this.contextMenu.positionX = event.clientX;
      this.contextMenu.positionY = event.clientY;
      this.contextMenu.display = 'block';
      this.contextMenuEvent = event;
    }
  }

  // handleMenuItemClick(action: string) {
  //   console.log('CLick');
  //   if (this.contextMenu) {
  //     this.contextMenu.display = 'none'; // Hide the context menu
  //   }
  // }



  apply(tableName: string) {
    const selectedWires = this.selectedOptions[tableName];
    const selectedWireNames = Object.keys(selectedWires).filter(option => selectedWires[option]);
    const formattedWireNames = selectedWireNames.map(wire => `@${wire}`).join(',');
  }


  clearTableRows(tableName: any) {
    clearTableRows(tableName);
  }

  onHeadlineChange(selectedValue: string) {
    this.category = '';
    this.mainwire = selectedValue;
    console.log(this.mainwire);
    requestMenuDetails(this.user_id, this.access_token, this.mainwire);
    // if (menuFileName) {
    //   this.http.get(`assets/json/${menuFileName}`).subscribe(
    //     (data: any) => {
    //       this.jsonData = data;
    //       this.resetAndAddSelectElements();
    //     },
    //     (error) => {
    //       console.error("Error loading menu file:", error);
    //       this.resetSelectElements();
    //     }
    //   );
    // }
  }
  resetSelectElements() {
    const existingSelectElements = document.querySelectorAll('.new-select');
    existingSelectElements.forEach((element) => {
      element.remove();
    });
  }


  onCategoryChange(selectedValue: string) {
    this.category = selectedValue;
  }

  ReconnectConnection() {
    ConnectToServer();
  }

  onToggleLayout() {
    if (this.toggleValue = !this.toggleValue) {
      console.log('Layout2');
    } else {
      console.log('Layout1');
    }
  }








}
