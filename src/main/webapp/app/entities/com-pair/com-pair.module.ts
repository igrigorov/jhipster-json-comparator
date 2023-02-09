import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ComPairComponent } from './list/com-pair.component';
import { ComPairUpdateComponent } from './update/com-pair-update.component';
import { ComPairRoutingModule } from './route/com-pair-routing.module';

@NgModule({
  imports: [SharedModule, ComPairRoutingModule],
  declarations: [ComPairComponent, ComPairUpdateComponent],
})
export class ComPairModule {}
