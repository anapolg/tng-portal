import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ServicePlatformService } from '../service-platform.service';
import { DialogDataService } from '../../shared/services/dialog/dialog.service';
import { UtilsService } from '../../shared/services/common/utils.service';

@Component({
	selector: 'app-slice-instance-detail',
	templateUrl: './slice-instance-detail.component.html',
	styleUrls: [ './slice-instance-detail.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class SliceInstanceDetailComponent implements OnInit {
	loading: boolean;
	detail = {};
	displayedColumns = [
		'nsrName',
		'slaName',
		'status',
		'isShared'
	];

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private servicePlatformService: ServicePlatformService,
		private dialogData: DialogDataService,
		private utilsService: UtilsService
	) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			this.requestSliceInstance(params[ 'id' ]);
		});
	}

	/**
     * Generates the HTTP request of a Slices instance by UUID.
     *
     * @param uuid ID of the selected instance to be displayed.
     *             Comming from the route.
     */
	async requestSliceInstance(uuid) {
		this.loading = true;
		const response = await this.servicePlatformService.getOneSliceInstance(uuid);

		this.loading = false;
		if (response) {
			this.detail = response;
		} else {
			this.utilsService.openSnackBar('There was an error fetching the slice instance', '');
			this.close();
		}
	}

	stopInstance() {
		const title = 'Are you sure...?';
		const content = 'Are you sure you want to terminate this instance?';
		const action = 'Terminate';

		this.dialogData.openDialog(title, content, action, async () => {
			this.loading = true;
			const response = await this.servicePlatformService.postOneSliceInstanceTermination(this.detail[ 'uuid' ]);

			this.loading = false;
			if (response) {
				this.utilsService.openSnackBar('Terminating ' + response[ 'name' ] + ' instance...', '');
				this.close();
			} else {
				this.utilsService.openSnackBar('There was an error terminating the instance', '');
			}
		});
	}

	copyToClipboard(value) {
		this.utilsService.copyToClipboard(value);
	}

	close() {
		this.router.navigate([ 'service-platform/slices/slices-instances' ]);
	}
}
