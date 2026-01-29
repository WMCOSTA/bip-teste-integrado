import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BeneficioService } from './beneficio.service';
import { Beneficio } from './beneficio.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h1>Gestão de Benefícios</h1>

      <div style="margin-bottom: 20px; border: 1px solid #ccc; padding: 15px; border-radius: 8px;">
        <h2>{{ editMode ? 'Editar' : 'Novo' }} Benefício</h2>
        <form (submit)="save()">
          <input [(ngModel)]="currentBeneficio.nome" name="nome" placeholder="Nome" required style="margin-right: 10px;">
          <input [(ngModel)]="currentBeneficio.descricao" name="descricao" placeholder="Descrição" style="margin-right: 10px;">
          <input type="number" [(ngModel)]="currentBeneficio.valor" name="valor" placeholder="Valor" required style="margin-right: 10px;">
          <button type="submit">{{ editMode ? 'Atualizar' : 'Criar' }}</button>
          <button type="button" (click)="resetForm()" *ngIf="editMode" style="margin-left: 5px;">Cancelar</button>
        </form>
      </div>

      <div style="margin-bottom: 20px; border: 1px solid #ccc; padding: 15px; border-radius: 8px;">
        <h2>Transferência</h2>
        <form (submit)="transfer()">
          <select [(ngModel)]="transferData.fromId" name="fromId" style="margin-right: 10px;">
            <option [ngValue]="null">Origem</option>
            <option *ngFor="let b of beneficios" [ngValue]="b.id">{{ b.nome }} (R$ {{ b.valor }})</option>
          </select>
          <select [(ngModel)]="transferData.toId" name="toId" style="margin-right: 10px;">
            <option [ngValue]="null">Destino</option>
            <option *ngFor="let b of beneficios" [ngValue]="b.id">{{ b.nome }} (R$ {{ b.valor }})</option>
          </select>
          <input type="number" [(ngModel)]="transferData.amount" name="amount" placeholder="Valor" style="margin-right: 10px;">
          <button type="submit">Transferir</button>
        </form>
      </div>

      <table border="1" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th>ID</th>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Ativo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let b of beneficios">
            <td>{{ b.id }}</td>
            <td>{{ b.nome }}</td>
            <td>{{ b.descricao }}</td>
            <td>R$ {{ b.valor | number:'1.2-2' }}</td>
            <td>{{ b.ativo ? 'Sim' : 'Não' }}</td>
            <td>
              <button (click)="edit(b)">Editar</button>
              <button (click)="delete(b.id!)" style="margin-left: 5px; color: red;">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class App implements OnInit {
  beneficios: Beneficio[] = [];
  currentBeneficio: Beneficio = this.initBeneficio();
  editMode = false;
  transferData = { fromId: null, toId: null, amount: 0 };

  constructor(private service: BeneficioService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.service.list().subscribe(data => this.beneficios = data);
  }

  initBeneficio(): Beneficio {
    return { nome: '', descricao: '', valor: 0, ativo: true };
  }

  save() {
    if (this.editMode) {
      this.service.update(this.currentBeneficio.id!, this.currentBeneficio).subscribe(() => {
        this.load();
        this.resetForm();
      });
    } else {
      this.service.create(this.currentBeneficio).subscribe(() => {
        this.load();
        this.resetForm();
      });
    }
  }

  edit(b: Beneficio) {
    this.currentBeneficio = { ...b };
    this.editMode = true;
  }

  delete(id: number) {
    if (confirm('Tem certeza?')) {
      this.service.delete(id).subscribe(() => this.load());
    }
  }

  resetForm() {
    this.currentBeneficio = this.initBeneficio();
    this.editMode = false;
  }

  transfer() {
    if (this.transferData.fromId && this.transferData.toId && this.transferData.amount > 0) {
      this.service.transfer(this.transferData.fromId, this.transferData.toId, this.transferData.amount)
        .subscribe({
          next: (msg) => {
            alert(msg);
            this.load();
            this.transferData = { fromId: null, toId: null, amount: 0 };
          },
          error: (err) => alert('Erro: ' + err.error)
        });
    }
  }
}
