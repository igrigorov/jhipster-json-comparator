import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IWsRequestsStateJSON } from '../ws-requests-state-json.model';
import { WsRequestsStateJSONService } from '../service/ws-requests-state-json.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './ws-requests-state-json-delete-dialog.component.html',
})
export class WsRequestsStateJSONDeleteDialogComponent {
  wsRequestsStateJSON?: IWsRequestsStateJSON;

  constructor(protected wsRequestsStateJSONService: WsRequestsStateJSONService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.wsRequestsStateJSONService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
