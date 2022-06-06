import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-detail-comment',
  templateUrl: './detail-comment.page.html',
  styleUrls: ['./detail-comment.page.scss'],
})
export class DetailCommentPage implements OnInit {
  title: Date;
  topTitle = 'Comment';
  item:any = []

  constructor(
    public modalCtrl: ModalController,
    public navParams: NavParams
  ) {
    this.title = new Date();
  }

  ngOnInit() {
    this.item = this.navParams.get('item');
    console.log(this.item, 'item')
  }

  showNotifications(){
  }

  closeModal() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  showAttr(){
  }

  showCc(){
  }

  showAttach(){
  }

}
