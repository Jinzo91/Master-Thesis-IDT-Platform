
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriberService } from '../../../services/subscriber.service';
import { finalize } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
    selector: 'idt-subscription-unsubscribe',
    templateUrl: './subscription-unsubscribe.component.html',
    styleUrls: ['./subscription-unsubscribe.component.scss']
})
export class SubscriptionUnsubscribeComponent implements OnDestroy {

    isLoading = false;

    resultType: 'success' | 'error';

    constructor(
        private _route: ActivatedRoute,
        private _subscriberService: SubscriberService,
        private _router: Router
    ) { }

    unsubscribe() {
        this.isLoading = true;

        this._route.params.subscribe((p) => {
            if (p.hash) {
                this._subscriberService.unsubscribe(p.hash).pipe(
                    finalize(() => this.isLoading = false),
                    untilDestroyed(this)
                ).subscribe((_) => {
                    this.resultType = 'success';
                }, (_) => {
                    this.resultType = 'error';
                });
            } else {
                this.isLoading = false;
                this.resultType = 'error';
            }
        });
    }

    goToDashboard() {
        this._router.navigateByUrl('/');
    }

    ngOnDestroy() {}
}
