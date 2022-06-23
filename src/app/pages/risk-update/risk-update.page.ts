import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-risk-update',
  templateUrl: './risk-update.page.html',
  styleUrls: ['./risk-update.page.scss'],
})
export class RiskUpdatePage implements OnInit {

  statusArr: any = []
  constructor(
    public modalController: ModalController,
  ) { }

  ngOnInit() {
  }

  closeModal() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
