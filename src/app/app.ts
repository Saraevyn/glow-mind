import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'https://glow-mind-api.onrender.com';

  protected readonly nome = signal('');
  protected readonly carregando = signal(false);
  protected readonly erro = signal('');
  protected readonly resposta = signal<OpiniaoResponse | null>(null);
  protected readonly dicas = ['Brenda', 'Ana', 'Nathan', 'Beatriz', 'Matheus Araujo'];
  protected readonly temResposta = computed(() => this.resposta() !== null);

  protected buscarOpiniao(): void {
    const nome = this.nome().trim();
    if (!nome) {
      this.erro.set('Escreve um nome primeiro, princesa.');
      this.resposta.set(null);
      return;
    }

    this.carregando.set(true);
    this.erro.set('');

    this.http
      .get<OpiniaoResponse>(`${this.apiBaseUrl}/opiniao/${encodeURIComponent(nome)}`)
      .subscribe({
        next: (resposta) => {
          this.resposta.set(resposta);
          this.carregando.set(false);
        },
        error: (error: HttpErrorResponse) => {
          this.erro.set(
            error.status === 0
              ? 'A API respondeu, mas o navegador bloqueou a chamada. Isso parece ser CORS na deploy da Render.'
              : `A API respondeu com erro ${error.status}.`
          );
          this.resposta.set(null);
          this.carregando.set(false);
        }
      });
  }

  protected preencherNome(nome: string): void {
    this.nome.set(nome);
    this.buscarOpiniao();
  }
}

interface OpiniaoResponse {
  nome: string;
  conhecido: boolean;
  encosto: boolean;
  opiniao: string;
}
