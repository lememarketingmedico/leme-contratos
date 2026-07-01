import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { createContractAction } from '@/app/actions';
import { toDateInputValue } from '@/lib/format';

const defaultServiceDescription =
  'gerenciamento de redes sociais, criação, desenvolvimento e manutenção de website, captação de imagens e conteúdos audiovisuais, gestão de tráfego pago, planejamento estratégico, produção de conteúdos digitais e demais atividades correlatas necessárias à execução da estratégia comercial e publicitária da CONTRATANTE';

function addMonths(date: Date, months: number) {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
}

export default async function NewContractPage() {
  await requireUser();

  const presets = await prisma.preset.findMany({ where: { active: true }, orderBy: { name: 'asc' } });
  const today = new Date();
  const endDate = addMonths(today, 6);

  return (
    <>
      <div className="page-header">
        <div>
          <p className="eyebrow">Novo PDF</p>
          <h1>Novo contrato</h1>
          <p>Escolha a predefinição, preencha os dados do cliente e gere o PDF automaticamente.</p>
        </div>
      </div>

      <form className="card" action={createContractAction}>
        <div className="form-section-title"><span>1</span><h2>Responsável e dados comerciais</h2></div>
        <div className="form-grid form-section">
          <div className="field">
            <label htmlFor="presetId">Predefinição</label>
            <select className="select" id="presetId" name="presetId">
              <option value="">Sem predefinição</option>
              {presets.map((preset) => (
                <option key={preset.id} value={preset.id}>{preset.name}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="serviceTitle">Título do serviço</label>
            <input className="input" id="serviceTitle" name="serviceTitle" defaultValue="Prestação de serviços de marketing digital" />
          </div>

          <div className="field">
            <label htmlFor="monthlyValue">Valor mensal</label>
            <input className="input" id="monthlyValue" name="monthlyValue" placeholder="1.197,00" required />
          </div>

          <div className="field">
            <label htmlFor="dueDay">Dia de vencimento</label>
            <input className="input" id="dueDay" name="dueDay" type="number" min="1" max="31" defaultValue="10" required />
          </div>

          <div className="field">
            <label htmlFor="startDate">Início</label>
            <input className="input" id="startDate" name="startDate" type="date" defaultValue={toDateInputValue(today)} required />
          </div>

          <div className="field">
            <label htmlFor="endDate">Término</label>
            <input className="input" id="endDate" name="endDate" type="date" defaultValue={toDateInputValue(endDate)} required />
          </div>

          <div className="field">
            <label htmlFor="citySignature">Cidade da assinatura</label>
            <input className="input" id="citySignature" name="citySignature" defaultValue="Araguari/MG" required />
          </div>

          <div className="field">
            <label htmlFor="signatureDate">Data da assinatura</label>
            <input className="input" id="signatureDate" name="signatureDate" type="date" defaultValue={toDateInputValue(today)} required />
          </div>
        </div>

        <div className="field form-section">
          <label htmlFor="monthlyValueText">Valor por extenso, opcional</label>
          <input className="input" id="monthlyValueText" name="monthlyValueText" placeholder="Deixe em branco para gerar automaticamente" />
        </div>

        <div className="field form-section">
          <label htmlFor="serviceDescription">Descrição dos serviços</label>
          <textarea className="textarea" id="serviceDescription" name="serviceDescription" defaultValue={defaultServiceDescription} />
        </div>

        <div className="form-section-title"><span>2</span><h2>Dados do cliente</h2></div>
        <div className="form-grid form-section">
          <div className="field">
            <label htmlFor="clientName">Nome ou razão social</label>
            <input className="input" id="clientName" name="clientName" required />
          </div>

          <div className="field">
            <label htmlFor="personType">Tipo</label>
            <select className="select" id="personType" name="personType">
              <option value="Pessoa física">Pessoa física</option>
              <option value="Pessoa jurídica">Pessoa jurídica</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="clientDocument">CPF ou CNPJ</label>
            <input className="input" id="clientDocument" name="clientDocument" placeholder="000.000.000-00 ou 00.000.000/0000-00" />
          </div>

          <div className="field">
            <label htmlFor="representative">Representante, se for empresa</label>
            <input className="input" id="representative" name="representative" />
          </div>

          <div className="field">
            <label htmlFor="clientEmail">E-mail</label>
            <input className="input" id="clientEmail" name="clientEmail" type="email" />
          </div>

          <div className="field">
            <label htmlFor="clientPhone">Telefone</label>
            <input className="input" id="clientPhone" name="clientPhone" />
          </div>

          <div className="field">
            <label htmlFor="clientCity">Cidade</label>
            <input className="input" id="clientCity" name="clientCity" />
          </div>

          <div className="field">
            <label htmlFor="clientState">Estado</label>
            <input className="input" id="clientState" name="clientState" maxLength={2} placeholder="MG" />
          </div>
        </div>

        <div className="field form-section">
          <label htmlFor="clientAddress">Endereço completo</label>
          <textarea className="textarea" id="clientAddress" name="clientAddress" placeholder="Rua, número, bairro, CEP" />
        </div>

        <div className="field form-section">
          <label htmlFor="contractNotes">Observações adicionais no contrato, opcional</label>
          <textarea className="textarea" id="contractNotes" name="contractNotes" placeholder="Use apenas se quiser inserir uma observação extra no PDF." />
        </div>

        <div className="actions-row">
          <button className="primary-button" type="submit">Gerar contrato em PDF</button>
          <a className="secondary-button" href="/contratos">Cancelar</a>
        </div>
      </form>
    </>
  );
}
