"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function CadastroPage() {
  const router = useRouter();
  const { cadastrar } = useAuth();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");

  const [cep, setCep] = useState("");
  const [estado, setEstado] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [cidade, setCidade] = useState("");

  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleCadastro(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");

    if (
      !nome.trim() ||
      !email.trim() ||
      !telefone.trim() ||
      !cep.trim() ||
      !estado.trim() ||
      !endereco.trim() ||
      !numero.trim() ||
      !cidade.trim() ||
      !senha ||
      !confirmarSenha
    ) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    if (senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    setCarregando(true);

    try {
      const sucesso = await cadastrar(
        nome,
        email,
        telefone,
        senha,
        cep,
        estado,
        endereco,
        numero,
        complemento,
        cidade
      );

      if (!sucesso) {
        setErro("Este e-mail já está cadastrado.");
        setCarregando(false);
        return;
      }

      router.push("/minha-conta");
    } catch {
      setErro(
        "Não foi possível criar sua conta. Verifique os dados e tente novamente."
      );
      setCarregando(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#faf8f5]">
      {/* Cabeçalho */}
      <header className="border-b border-[#e7dfd5]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 sm:px-10 lg:px-12">
          <Link
            href="/"
            className="font-[family-name:var(--font-cormorant)] text-3xl tracking-[0.25em] text-[#1f1d1a]"
          >
            LUMÉA
          </Link>

          <Link
            href="/login"
            className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.2em] text-[#756f69] transition hover:text-[#8c7355]"
          >
            Já tenho uma conta
          </Link>
        </div>
      </header>

      {/* Cadastro */}
      <section className="px-6 py-16 sm:px-10 lg:py-24">
        <div className="mx-auto max-w-xl">
          <div className="text-center">
            <span className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.35em] text-[#8c7355]">
              LUMÉA
            </span>

            <h1 className="mt-5 font-[family-name:var(--font-cormorant)] text-5xl font-medium text-[#1f1d1a] sm:text-6xl">
              Criar sua conta
            </h1>

            <p className="mx-auto mt-5 max-w-md font-[family-name:var(--font-montserrat)] text-sm leading-7 text-[#756f69]">
              Crie sua conta para acompanhar seus pedidos e ter uma
              experiência personalizada na LUMÉA.
            </p>
          </div>

          <form onSubmit={handleCadastro} className="mt-12">
            {/* Dados pessoais */}
            <div>
              <p className="mb-6 font-[family-name:var(--font-cormorant)] text-2xl text-[#1f1d1a]">
                Dados pessoais
              </p>

              {/* Nome */}
              <div>
                <label
                  htmlFor="nome"
                  className="mb-2 block font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.2em] text-[#5f5042]"
                >
                  Nome completo
                </label>

                <input
                  id="nome"
                  type="text"
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                  autoComplete="name"
                  placeholder="Seu nome completo"
                  className="h-14 w-full border border-[#d8c7b0] bg-white px-4 font-[family-name:var(--font-montserrat)] text-sm text-[#1f1d1a] outline-none transition placeholder:text-[#aaa19a] focus:border-[#8c7355]"
                />
              </div>

              {/* E-mail */}
              <div className="mt-6">
                <label
                  htmlFor="email"
                  className="mb-2 block font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.2em] text-[#5f5042]"
                >
                  E-mail
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  placeholder="seuemail@exemplo.com"
                  className="h-14 w-full border border-[#d8c7b0] bg-white px-4 font-[family-name:var(--font-montserrat)] text-sm text-[#1f1d1a] outline-none transition placeholder:text-[#aaa19a] focus:border-[#8c7355]"
                />
              </div>

              {/* Telefone */}
              <div className="mt-6">
                <label
                  htmlFor="telefone"
                  className="mb-2 block font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.2em] text-[#5f5042]"
                >
                  Telefone
                </label>

                <input
                  id="telefone"
                  type="tel"
                  value={telefone}
                  onChange={(event) => setTelefone(event.target.value)}
                  autoComplete="tel"
                  placeholder="(11) 99999-9999"
                  className="h-14 w-full border border-[#d8c7b0] bg-white px-4 font-[family-name:var(--font-montserrat)] text-sm text-[#1f1d1a] outline-none transition placeholder:text-[#aaa19a] focus:border-[#8c7355]"
                />
              </div>
            </div>

            {/* Endereço */}
            <div className="mt-12 border-t border-[#e7dfd5] pt-10">
              <p className="mb-2 font-[family-name:var(--font-cormorant)] text-2xl text-[#1f1d1a]">
                Endereço de entrega
              </p>

              <p className="mb-6 font-[family-name:var(--font-montserrat)] text-xs leading-5 text-[#756f69]">
                Informe o endereço que será utilizado para suas entregas.
              </p>

              {/* CEP */}
              <div>
                <label
                  htmlFor="cep"
                  className="mb-2 block font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.2em] text-[#5f5042]"
                >
                  CEP *
                </label>

                <input
                  id="cep"
                  type="text"
                  value={cep}
                  onChange={(event) => setCep(event.target.value)}
                  autoComplete="postal-code"
                  placeholder="00000-000"
                  maxLength={9}
                  className="h-14 w-full border border-[#d8c7b0] bg-white px-4 font-[family-name:var(--font-montserrat)] text-sm text-[#1f1d1a] outline-none transition placeholder:text-[#aaa19a] focus:border-[#8c7355]"
                />
              </div>

              {/* Estado e Cidade */}
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="estado"
                    className="mb-2 block font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.2em] text-[#5f5042]"
                  >
                    Estado *
                  </label>

                  <input
                    id="estado"
                    type="text"
                    value={estado}
                    onChange={(event) =>
                      setEstado(event.target.value.toUpperCase())
                    }
                    autoComplete="address-level1"
                    placeholder="SP"
                    maxLength={2}
                    className="h-14 w-full border border-[#d8c7b0] bg-white px-4 font-[family-name:var(--font-montserrat)] text-sm text-[#1f1d1a] outline-none transition placeholder:text-[#aaa19a] focus:border-[#8c7355]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="cidade"
                    className="mb-2 block font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.2em] text-[#5f5042]"
                  >
                    Cidade *
                  </label>

                  <input
                    id="cidade"
                    type="text"
                    value={cidade}
                    onChange={(event) => setCidade(event.target.value)}
                    autoComplete="address-level2"
                    placeholder="Sua cidade"
                    className="h-14 w-full border border-[#d8c7b0] bg-white px-4 font-[family-name:var(--font-montserrat)] text-sm text-[#1f1d1a] outline-none transition placeholder:text-[#aaa19a] focus:border-[#8c7355]"
                  />
                </div>
              </div>

              {/* Endereço e Número */}
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-[1fr_140px]">
                <div>
                  <label
                    htmlFor="endereco"
                    className="mb-2 block font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.2em] text-[#5f5042]"
                  >
                    Endereço *
                  </label>

                  <input
                    id="endereco"
                    type="text"
                    value={endereco}
                    onChange={(event) => setEndereco(event.target.value)}
                    autoComplete="street-address"
                    placeholder="Rua, avenida..."
                    className="h-14 w-full border border-[#d8c7b0] bg-white px-4 font-[family-name:var(--font-montserrat)] text-sm text-[#1f1d1a] outline-none transition placeholder:text-[#aaa19a] focus:border-[#8c7355]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="numero"
                    className="mb-2 block font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.2em] text-[#5f5042]"
                  >
                    Número *
                  </label>

                  <input
                    id="numero"
                    type="text"
                    value={numero}
                    onChange={(event) => setNumero(event.target.value)}
                    autoComplete="address-line2"
                    placeholder="123"
                    className="h-14 w-full border border-[#d8c7b0] bg-white px-4 font-[family-name:var(--font-montserrat)] text-sm text-[#1f1d1a] outline-none transition placeholder:text-[#aaa19a] focus:border-[#8c7355]"
                  />
                </div>
              </div>

              {/* Complemento */}
              <div className="mt-6">
                <label
                  htmlFor="complemento"
                  className="mb-2 block font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.2em] text-[#5f5042]"
                >
                  Complemento
                </label>

                <input
                  id="complemento"
                  type="text"
                  value={complemento}
                  onChange={(event) => setComplemento(event.target.value)}
                  autoComplete="address-line2"
                  placeholder="Apartamento, bloco, referência..."
                  className="h-14 w-full border border-[#d8c7b0] bg-white px-4 font-[family-name:var(--font-montserrat)] text-sm text-[#1f1d1a] outline-none transition placeholder:text-[#aaa19a] focus:border-[#8c7355]"
                />
              </div>
            </div>

            {/* Segurança */}
            <div className="mt-12 border-t border-[#e7dfd5] pt-10">
              <p className="mb-6 font-[family-name:var(--font-cormorant)] text-2xl text-[#1f1d1a]">
                Segurança
              </p>

              {/* Senha */}
              <div>
                <label
                  htmlFor="senha"
                  className="mb-2 block font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.2em] text-[#5f5042]"
                >
                  Senha
                </label>

                <input
                  id="senha"
                  type="password"
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  autoComplete="new-password"
                  placeholder="Mínimo de 6 caracteres"
                  className="h-14 w-full border border-[#d8c7b0] bg-white px-4 font-[family-name:var(--font-montserrat)] text-sm text-[#1f1d1a] outline-none transition placeholder:text-[#aaa19a] focus:border-[#8c7355]"
                />
              </div>

              {/* Confirmar senha */}
              <div className="mt-6">
                <label
                  htmlFor="confirmarSenha"
                  className="mb-2 block font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.2em] text-[#5f5042]"
                >
                  Confirmar senha
                </label>

                <input
                  id="confirmarSenha"
                  type="password"
                  value={confirmarSenha}
                  onChange={(event) =>
                    setConfirmarSenha(event.target.value)
                  }
                  autoComplete="new-password"
                  placeholder="Digite sua senha novamente"
                  className="h-14 w-full border border-[#d8c7b0] bg-white px-4 font-[family-name:var(--font-montserrat)] text-sm text-[#1f1d1a] outline-none transition placeholder:text-[#aaa19a] focus:border-[#8c7355]"
                />
              </div>
            </div>

            {/* Erro */}
            {erro && (
              <div className="mt-6 border border-[#d8c7b0] bg-[#f3eee8] px-4 py-4">
                <p className="font-[family-name:var(--font-montserrat)] text-xs leading-5 text-[#8c7355]">
                  {erro}
                </p>
              </div>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={carregando}
              className="mt-8 flex h-14 w-full items-center justify-center bg-[#1f1d1a] px-6 font-[family-name:var(--font-montserrat)] text-[10px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-[#8c7355] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {carregando ? "Criando conta..." : "Criar minha conta"}
            </button>
          </form>

          {/* Login */}
          <div className="mt-10 border-t border-[#e7dfd5] pt-8 text-center">
            <p className="font-[family-name:var(--font-montserrat)] text-xs text-[#756f69]">
              Já possui uma conta?
            </p>

            <Link
              href="/login"
              className="mt-3 inline-block font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.18em] text-[#8c7355] transition hover:text-[#1f1d1a]"
            >
              Entrar na minha conta
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}