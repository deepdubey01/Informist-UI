import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CsvDownloadService {

  downloadCsv(data: any[], filename: string) {
    const csv = this.convertArrayToCsv(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  private convertArrayToCsv(data: any[]): string {
    let csv = 'subscription_id,subscription_type,user_id,fname,lname,email_id,mobile_no,subscription_amount,package_id,package_code,feed_type,package_type,amount,gst,discount,total_amount,subscription_until,package_name,sub_package_name,sub_package_id,sub_package_code,category_name,category_id,category_code\n';

    data.forEach((item) => {
      const subscription: any = item;
      subscription.packages.forEach((packageItem: any) => {
        packageItem.sub_packages.forEach((subPackage: any) => {
          subPackage.categories.forEach((category: any) => {
            csv += `${subscription.subscription_id},${subscription.subscription_type},${subscription.user_id},${subscription.fname},${subscription.lname},${subscription.email_id},${subscription.mobile_no},${subscription.subscription_amount},${packageItem.package_id},${packageItem.package_code},${packageItem.feed_type},${packageItem.package_type},${packageItem.amount},${packageItem.gst},${packageItem.discount},${packageItem.total_amount},${packageItem.subscription_until},${packageItem.package_name},${subPackage.sub_package_name},${subPackage.sub_package_id},${subPackage.sub_package_code},${category.category_name},${category.category_id},${category.category_code}\n`;
          });
        });
      });
    });

    return csv;
  }
}
